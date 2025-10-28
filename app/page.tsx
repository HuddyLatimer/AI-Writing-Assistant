import WritingGenerator from "@/components/writing-generator";

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">AI Writing Assistant</h1>
        <p className="text-muted-foreground">
          Generate various types of content with AI-powered real-time streaming
        </p>
      </div>
      <WritingGenerator />
    </div>
  );
}
