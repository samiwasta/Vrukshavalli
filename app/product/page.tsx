import { Suspense } from "react";
import ProductGallery from "./ProductGallery";

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductGallerySkeleton />}>
      <ProductGallery />
    </Suspense>
  );
}

function ProductGallerySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="h-10 w-64 bg-primary-100 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-primary-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
