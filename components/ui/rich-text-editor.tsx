"use client";

import { useEffect, useRef, useState, useCallback, type MouseEvent, type KeyboardEvent } from "react";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListNumbers,
  IconPhotoPlus,
  IconLink,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconCode,
  IconQuote,
  IconClearFormatting,
} from "@tabler/icons-react";
import { cn } from "@/lib/util";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
  enableImageUpload?: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;
  className?: string;
};

const ALLOWED_TAGS = new Set([
  "P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", 
  "A", "IMG", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", 
  "CODE", "PRE", "DIV", "SPAN"
]);

function sanitizeHtml(raw: string): string {
  if (!raw.trim()) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "text/html");

  const cleanNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }

    const el = node as HTMLElement;
    if (!ALLOWED_TAGS.has(el.tagName)) {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
      return;
    }

    // Clean attributes for all elements
    const allowedAttrs = new Set();
    if (el.tagName === "A") {
      allowedAttrs.add("href");
      allowedAttrs.add("target");
      allowedAttrs.add("rel");
    } else if (el.tagName === "IMG") {
      allowedAttrs.add("src");
      allowedAttrs.add("alt");
    }

    for (const attr of Array.from(el.attributes)) {
      if (!allowedAttrs.has(attr.name)) {
        el.removeAttribute(attr.name);
      }
    }

    // Special handling for links
    if (el.tagName === "A") {
      const href = el.getAttribute("href") ?? "";
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        el.removeAttribute("href");
      } else {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    }

    // Special handling for images
    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") ?? "";
      if (!src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("data:image/")) {
        el.removeAttribute("src");
      }
    }

    Array.from(el.childNodes).forEach(cleanNode);
  };

  Array.from(doc.body.childNodes).forEach(cleanNode);
  return doc.body.innerHTML.trim();
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeightClassName = "min-h-[180px]",
  enableImageUpload = true,
  onImageUpload,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const [currentBlockFormat, setCurrentBlockFormat] = useState<string>("p");

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    
    const formats = new Set<string>();
    let blockFormat = "p";
    
    try {
      // Text formatting
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      
      // Lists
      if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
      if (document.queryCommandState("insertOrderedList")) formats.add("ol");
      
      // Get current selection for block format and alignment detection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let element = range.startContainer as Node;
        
        // Find the closest element node
        while (element && element.nodeType !== Node.ELEMENT_NODE) {
          element = element.parentNode!;
        }
        
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          const el = element as Element;
          const computedStyle = window.getComputedStyle(el);
          const textAlign = computedStyle.textAlign;
          
          // Check alignment
          switch (textAlign) {
            case "left":
            case "start":
              formats.add("left");
              break;
            case "center":
              formats.add("center");
              break;
            case "right":
            case "end":
              formats.add("right");
              break;
          }
          
          // Find block-level element for format detection
          let blockElement = el;
          while (blockElement && blockElement !== editorRef.current) {
            const tagName = blockElement.tagName.toLowerCase();
            if (["h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "div"].includes(tagName)) {
              if (tagName === "h1") blockFormat = "1";
              else if (tagName === "h2") blockFormat = "2";
              else if (tagName === "h3") blockFormat = "3";
              else if (tagName === "h4") blockFormat = "4";
              else if (tagName === "h5") blockFormat = "5";
              else if (tagName === "h6") blockFormat = "6";
              else if (tagName === "blockquote") {
                blockFormat = "blockquote";
                formats.add("blockquote");
              } else {
                blockFormat = "p";
              }
              break;
            }
            blockElement = blockElement.parentElement!;
          }
        }
      }
    } catch (error) {
      // Silently handle any errors with command state checking
      console.warn("Error updating active formats:", error);
    }

    setActiveFormats(formats);
    setCurrentBlockFormat(blockFormat);
  }, []);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    
    const cleaned = sanitizeHtml(el.innerHTML);
    if (cleaned !== el.innerHTML) el.innerHTML = cleaned;
    onChange(cleaned);
  }, [onChange]);

  const emitChangeWithFormatUpdate = useCallback(() => {
    emitChange();
    // Delay format update to allow DOM changes to settle
    setTimeout(() => {
      updateActiveFormats();
    }, 10);
  }, [emitChange, updateActiveFormats]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
    // Update formats when content changes
    setTimeout(updateActiveFormats, 10);
  }, [value, updateActiveFormats]);

  // Initial format update on mount
  useEffect(() => {
    setTimeout(updateActiveFormats, 100);
  }, [updateActiveFormats]);

  const runCommand = useCallback((command: string, valueArg?: string) => {
    if (!editorRef.current) return;
    
    // Store current selection before focusing
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    editorRef.current.focus();
    
    // Restore selection if it was lost
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    try {
      let success = false;
      
      // Special handling for alignment commands
      if (command.startsWith("justify")) {
        // For alignment, check if already active and toggle appropriately
        const currentActive = activeFormats.has(command.replace("justify", "").toLowerCase());
        
        if (currentActive && command !== "justifyLeft") {
          // If current alignment is active and it's not left, switch to left (default)
          success = document.execCommand("justifyLeft", false);
        } else if (!currentActive) {
          // If not active, apply the alignment
          success = document.execCommand(command, false, valueArg);
        }
      } else if (command === "formatBlock") {
        // Special handling for block format commands
        success = document.execCommand(command, false, valueArg);
        
        // For formatBlock commands, we need a longer delay for proper detection
        setTimeout(() => {
          emitChange();
          updateActiveFormats();
        }, 100);
        return;
      } else {
        // Standard command execution
        success = document.execCommand(command, false, valueArg);
      }
      
      // Log success for debugging
      if (!success) {
        console.warn("Command may not have executed successfully:", command);
      }
      
      // Update formats after a brief delay to allow DOM to update
      setTimeout(() => {
        emitChangeWithFormatUpdate();
      }, 50);
    } catch (error) {
      console.warn("Error executing command:", command, error);
      emitChangeWithFormatUpdate();
    }
  }, [emitChange, emitChangeWithFormatUpdate, activeFormats, updateActiveFormats]);

  const keepSelection = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    if (isCtrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          runCommand("bold");
          break;
        case "i":
          e.preventDefault();
          runCommand("italic");
          break;
        case "u":
          e.preventDefault();
          runCommand("underline");
          break;
        case "k":
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "";
    
    const url = window.prompt("Enter URL:", "https://");
    if (url && url !== "https://") {
      if (selectedText) {
        runCommand("createLink", url);
      } else {
        // If no text is selected, insert link with URL as text
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        runCommand("insertHTML", linkHtml);
      }
    }
  };

  const insertHeading = (level: number) => {
    runCommand("formatBlock", `h${level}`);
  };

  const formatToParagraph = () => {
    runCommand("formatBlock", "p");
  };

  const toggleBlockquote = () => {
    if (activeFormats.has("blockquote")) {
      runCommand("formatBlock", "p");
    } else {
      runCommand("formatBlock", "blockquote");
    }
  };

  const handleImagePick = async (file: File) => {
    const uploadedUrl = onImageUpload ? await onImageUpload(file) : await fileToDataUrl(file);
    if (!uploadedUrl) return;
    runCommand("insertImage", uploadedUrl);
  };

  const toolbarButtons = [
    {
      icon: IconBold,
      command: "bold",
      label: "Bold (Ctrl+B)",
      active: activeFormats.has("bold"),
    },
    {
      icon: IconItalic,
      command: "italic",
      label: "Italic (Ctrl+I)",
      active: activeFormats.has("italic"),
    },
    {
      icon: IconUnderline,
      command: "underline",
      label: "Underline (Ctrl+U)",
      active: activeFormats.has("underline"),
    },
    {
      icon: IconList,
      command: "insertUnorderedList",
      label: "Bullet List",
      active: activeFormats.has("ul"),
    },
    {
      icon: IconListNumbers,
      command: "insertOrderedList",
      label: "Numbered List",
      active: activeFormats.has("ol"),
    },
    {
      icon: IconAlignLeft,
      command: "justifyLeft",
      label: "Align Left",
      active: activeFormats.has("left"),
    },
    {
      icon: IconAlignCenter,
      command: "justifyCenter",
      label: "Align Center",
      active: activeFormats.has("center"),
    },
    {
      icon: IconAlignRight,
      command: "justifyRight",
      label: "Align Right",
      active: activeFormats.has("right"),
    },
    {
      icon: IconQuote,
      command: "formatBlock",
      commandValue: "blockquote",
      label: "Quote",
      active: activeFormats.has("blockquote"),
    },
  ];

  return (
    <div className={cn("rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-100 bg-linear-to-r from-stone-50 to-stone-100/50 p-2">
        {/* Format Buttons */}
        <div className="flex items-center gap-0.5">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.command + (btn.commandValue || "")}
              type="button"
              onMouseDown={keepSelection}
              onClick={() => {
                if (btn.command === "formatBlock" && btn.commandValue === "blockquote") {
                  toggleBlockquote();
                } else {
                  runCommand(btn.command, btn.commandValue);
                }
              }}
              className={cn(
                "h-8 w-8 rounded-lg text-stone-600 hover:bg-white hover:text-stone-800 transition-all duration-150 flex items-center justify-center shadow-sm",
                btn.active && "bg-primary-100 text-primary-700 shadow-inner"
              )}
              title={btn.label}
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-stone-300 mx-1" />

        {/* Heading Dropdown */}
        <select
          className="text-xs bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-600 hover:border-stone-300 transition-colors"
          value={currentBlockFormat === "blockquote" ? "p" : currentBlockFormat}
          onChange={(e) => {
            editorRef.current?.focus();
            const newValue = e.target.value;
            
            if (newValue === "p") {
              formatToParagraph();
            } else {
              insertHeading(parseInt(newValue));
            }
            
            // Force format update after heading change
            setTimeout(updateActiveFormats, 100);
          }}
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <div className="h-6 w-px bg-stone-300 mx-1" />

        {/* Additional Actions */}
        <button
          type="button"
          onMouseDown={keepSelection}
          onClick={insertLink}
          className="h-8 w-8 rounded-lg text-stone-600 hover:bg-white hover:text-stone-800 transition-all duration-150 flex items-center justify-center shadow-sm"
          title="Insert Link (Ctrl+K)"
        >
          <IconLink className="w-4 h-4" />
        </button>

        {enableImageUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImagePick(file);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            <button
              type="button"
              onMouseDown={keepSelection}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 rounded-lg text-stone-600 hover:bg-white hover:text-stone-800 transition-all duration-150 flex items-center justify-center shadow-sm"
              title="Upload Image"
            >
              <IconPhotoPlus className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          minHeightClassName,
          "w-full px-4 py-3 text-sm leading-relaxed text-stone-700 focus:outline-none bg-white transition-colors",
          "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2",
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2",
          "[&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1",
          "[&_p]:mb-2 [&_p:last-child]:mb-0",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2",
          "[&_li]:mb-1",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-stone-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-600 [&_blockquote]:my-3",
          "[&_a]:text-primary-600 [&_a]:underline [&_a:hover]:text-primary-700",
          "[&_code]:bg-stone-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2"
        )}
        data-placeholder={placeholder}
        onInput={emitChangeWithFormatUpdate}
        onKeyUp={(e) => {
          // Update formats on key releases that might change formatting
          if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Home" || e.key === "End") {
            setTimeout(updateActiveFormats, 10);
          }
        }}
        onMouseUp={() => {
          // Update formats when clicking/selecting text
          setTimeout(updateActiveFormats, 10);
        }}
        onFocus={() => {
          // Update formats when editor gains focus
          setTimeout(updateActiveFormats, 10);
        }}
        onKeyDown={handleKeyDown}
      />
      
      <style jsx>{`
        div[contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: rgb(168 162 158);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
