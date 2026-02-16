import { Button } from "@/components/ui/button";

export default function CourseBanner() {
    return (
        <section className="w-full py-8 sm:py-10 lg:py-12 bg-[radial-gradient(circle_at_top_left,#dcead8,transparent_55%),radial-gradient(circle_at_bottom_right,#cedbd7,transparent_60%),linear-gradient(180deg,#fbfbfb,rgba(251,251,251,0.9))]">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-primary-100/60 bg-white/80 shadow-[0_25px_60px_-30px_rgba(4,30,22,0.6)] backdrop-blur">
                    <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-100/70 blur-3xl" />
                    <div className="absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-successLight/80 blur-3xl" />

                    <div className="relative flex flex-col items-center text-center px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-700 font-mono leading-tight max-w-3xl">
                            Transform Your Space into a Thriving Garden
                        </h2>
                        <p className="mt-3 text-base sm:text-lg text-foreground/80 max-w-2xl">
                            Join our expert-led programs and discover the art of sustainable gardening
                        </p>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 border border-primary-100/50 px-4 py-3">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-2xl">🧠</span>
                                </div>
                                <p className="text-sm font-semibold text-primary-700">Clear Mindset</p>
                                <p className="text-xs text-foreground/70">Strategic approach to farming & business</p>
                            </div>

                            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 border border-primary-100/50 px-4 py-3">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-2xl">🗺️</span>
                                </div>
                                <p className="text-sm font-semibold text-primary-700">Practical Roadmap</p>
                                <p className="text-xs text-foreground/70">Step-by-step planning & execution</p>
                            </div>

                            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 border border-primary-100/50 px-4 py-3">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <p className="text-sm font-semibold text-primary-700">Reality-Based Learning</p>
                                <p className="text-xs text-foreground/70">Experience-driven insights & guidance</p>
                            </div>
                        </div>

                        <Button className="mt-5 rounded-full px-8 py-3 text-base font-semibold">
                            Explore Learning Programs
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}