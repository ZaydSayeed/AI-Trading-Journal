import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTrades } from "@/hooks/useTrades";
import { TradeCreate, Trade } from "@/api/trades";
import { createTrade } from "@/api/trades";
import { useToast } from "@/hooks/use-toast";

export default function AddTrade() {
  const navigate = useNavigate();
  const { fetchTrades } = useTrades();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [createdTrade, setCreatedTrade] = useState<Trade | null>(null);
  const [formData, setFormData] = useState<TradeCreate>({
    ticker: "",
    entry: 0,
    exit: null,
    direction: "long",
    setup: "",
    notes: null,
    tags: null,
    date: new Date().toISOString().split("T")[0],
  });
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const tradeData: TradeCreate = {
        ...formData,
        tags: tags.length > 0 ? tags : null,
      };

      const newTrade = await createTrade(tradeData);
      setCreatedTrade(newTrade);
      
      // Refresh trades list
      await fetchTrades();
      
      toast({
        variant: "success",
        title: "Success",
        description: "Trade created successfully!",
      });

      // Show AI feedback if available
      if (newTrade.ai_feedback) {
        setShowAIFeedback(true);
      }
      
      // Reset form
      setFormData({
        ticker: "",
        entry: 0,
        exit: null,
        direction: "long",
        setup: "",
        notes: null,
        tags: null,
        date: new Date().toISOString().split("T")[0],
      });
      setTagsInput("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trade",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Add New Trade
          </h1>
          <p className="text-muted-foreground mt-2">
            Record a new trade and get instant AI feedback
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trade Details</CardTitle>
            <CardDescription>Fill in the information about your trade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="ticker" className="text-sm font-medium">
                    Ticker *
                  </label>
                  <Input
                    id="ticker"
                    value={formData.ticker}
                    onChange={(e) =>
                      setFormData({ ...formData, ticker: e.target.value.toUpperCase() })
                    }
                    placeholder="AAPL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="entry" className="text-sm font-medium">
                    Entry Price *
                  </label>
                  <Input
                    id="entry"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.entry || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        entry: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="150.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="exit" className="text-sm font-medium">
                    Exit Price
                  </label>
                  <Input
                    id="exit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.exit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exit: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="155.00"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="direction" className="text-sm font-medium">
                    Direction *
                  </label>
                  <Select
                    value={formData.direction}
                    onValueChange={(value: "long" | "short") =>
                      setFormData({ ...formData, direction: value })
                    }
                  >
                    <SelectTrigger id="direction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="setup" className="text-sm font-medium">
                  Setup *
                </label>
                <Input
                  id="setup"
                  value={formData.setup || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, setup: e.target.value })
                  }
                  placeholder="Breakout, Pullback, Reversal, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="momentum, tech, earnings"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value || null,
                    })
                  }
                  placeholder="Additional notes about this trade..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} variant="neon" className="flex-1">
                  {loading ? "Adding Trade..." : "Add Trade"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/history")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Feedback Modal */}
        <Dialog open={showAIFeedback} onOpenChange={setShowAIFeedback}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Feedback</DialogTitle>
              <DialogDescription>
                Your trade has been analyzed by AI
              </DialogDescription>
            </DialogHeader>
            {createdTrade?.ai_feedback && (
              <div className="mt-4 space-y-4">
                <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {createdTrade.ai_feedback}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAIFeedback(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="neon"
                    onClick={() => {
                      setShowAIFeedback(false);
                      navigate("/history");
                    }}
                  >
                    View in History
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
