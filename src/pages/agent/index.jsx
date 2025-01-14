import { useState, useRef, useEffect } from "react";
import tw from "tailwind-styled-components";
import WalletContextProvider from "../../components/WalletContextProvider";
import OpenAI from "openai";

const Container = tw.div`
  flex flex-col gap-10 px-10 pb-8 items-center
`;

const Header = tw.div`
  flex flex-col items-center gap-4
`;

const Title = tw.h1`
  text-[2.8rem] font-bold text-center header-typewriter
`;

const Subtitle = tw.p`
  text-[1.5rem] text-center max-w-screen-lg
`;

const ContentContainer = tw.div`
  w-full flex gap-8 justify-center ai-container
`;

const ChatContainer = tw.div`
  w-full max-w-xl flex flex-col gap-4 ai-item
`;

const ChatMessages = tw.div`
  flex flex-col gap-4 h-[500px] overflow-y-auto p-4 rounded-lg bg-[var(--navBarColor)] border-2 border-[var(--borderColor)]
`;

const AvatarContainer = tw.div`
  flex flex-col gap-4 h-[500px] overflow-y-auto p-4 rounded-lg border-2 border-[var(--borderColor)] ai-item
`;

const Message = tw.div`
  flex flex-col gap-2 p-3 rounded-lg
  ${(props) =>
    props.isUser
      ? "bg-[var(--buttonColor)] self-end"
      : "bg-[var(--tabSelectColor)] self-start"}
`;

const InputContainer = tw.div`
  flex gap-4 w-full
`;

const Input = tw.input`
  flex-1 p-3 rounded-lg bg-[var(--navBarColor)] outline-none border-2 border-[var(--borderColor)]
`;

const Button = tw.button`
  px-6 py-2 rounded-lg font-bold bg-[var(--buttonColor)]
`;

const ImageContainer = tw.div`
  w-full max-w-xl flex flex-col gap-4
`;

const GeneratedImage = tw.img`
  max-w-full rounded-lg
`;

const Agent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiMessage = {
        text: "",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);

      const stream = await openai.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "gpt-4",
        stream: true,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], text: fullResponse },
        ]);
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your request.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isImageLoading) return;

    setIsImageLoading(true);

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt + " 3d model character",
        n: 1,
        size: "1024x1024",
      });

      setGeneratedImage(response.data[0].url);
      setImagePrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <WalletContextProvider>
      <Container>
        <Header>
          <Title>AI Assistant</Title>
          <Subtitle>
            Chat with our AI assistant and generate your custom character
          </Subtitle>
        </Header>

        <ContentContainer>
          <ImageContainer>
            <AvatarContainer>
              {generatedImage && (
                <GeneratedImage
                  src={generatedImage}
                  alt="Generated Character"
                />
              )}
            </AvatarContainer>
            <InputContainer>
              <Input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe character..."
                onKeyPress={(e) => e.key === "Enter" && handleGenerateImage()}
                disabled={isImageLoading}
              />
              <Button onClick={handleGenerateImage} disabled={isImageLoading}>
                {isImageLoading ? "Generating..." : "Generate"}
              </Button>
            </InputContainer>
          </ImageContainer>
          <ChatContainer>
            <ChatMessages>
              {messages.map((msg, idx) => (
                <Message key={idx} isUser={msg.isUser}>
                  {msg.text}
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </ChatMessages>
            <InputContainer>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </InputContainer>
          </ChatContainer>
        </ContentContainer>
      </Container>
    </WalletContextProvider>
  );
};

export default Agent;
