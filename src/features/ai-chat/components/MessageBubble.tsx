export default function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-harvest/15 text-soil rounded-br-sm' 
            : 'bg-white shadow-low text-neutral-800 rounded-bl-sm border border-neutral-100'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">👳🏽‍♂️</span>
            <span className="font-semibold text-soil text-xs">Krishi Mitra</span>
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
          {message.content}
        </p>
      </div>
    </div>
  );
}
