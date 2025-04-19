
import { useState } from 'react';
import { Loader2, MessageSquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getConversations, 
  createConversation, 
  deleteConversation,
  setActiveConversationId,
  getActiveConversationId,
  SavedConversation
} from '@/services/storageService';
import { toast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ConversationSidebarProps {
  onConversationChange: (conversationId: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ onConversationChange }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<SavedConversation[]>(() => 
    user ? getConversations(user.id) : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(getActiveConversationId());
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateConversation = () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const newConversation = createConversation(user.id);
      setConversations(prev => [...prev, newConversation]);
      setActiveId(newConversation.id);
      onConversationChange(newConversation.id);
      toast({
        title: "New conversation created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    try {
      deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      
      // If the active conversation was deleted, create a new one
      if (activeId === id) {
        const newConversation = createConversation(user.id);
        setConversations(prev => [...prev, newConversation]);
        setActiveId(newConversation.id);
        onConversationChange(newConversation.id);
      }
      
      toast({
        title: "Conversation deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setActiveConversationId(id);
    onConversationChange(id);
    setIsOpen(false);
  };

  // Sort conversations by updated date
  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          Conversations
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Your Conversations</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4">
          <Button 
            onClick={handleCreateConversation}
            className="w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                New Conversation
              </>
            )}
          </Button>
          
          {sortedConversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No conversations yet. Start by creating a new one.
            </div>
          ) : (
            <div className="space-y-2">
              {sortedConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`flex justify-between items-center p-3 rounded-md cursor-pointer hover:bg-muted ${
                    activeId === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="truncate flex-1">
                    <span className="block font-medium">{conversation.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConversationSidebar;
