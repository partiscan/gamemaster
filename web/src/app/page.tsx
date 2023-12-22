import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-2xl mb-6">Orchestrate your games</h1>
      <div className="border bg-primary-foreground rounded-lg h-64 flex items-center justify-center text-gray-500">
        <p className="text-center">Some game</p>
      </div>
      <div className="mx-auto mt-8 w-fit">
        <Button size="lg">Add Game</Button>
      </div>
    </>
  );
}
