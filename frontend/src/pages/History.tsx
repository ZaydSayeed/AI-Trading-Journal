import { useState, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTrades, Trade } from "@/hooks/useTrades";
import { format } from "date-fns";
import { Search, Trash2, Edit2, X } from "lucide-react";
import { TradeUpdate } from "@/api/trades";

export default function History() {
  const { trades, loading, removeTrade, editTrade } = useTrades();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [editFormData, setEditFormData] = useState<TradeUpdate>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState<string>("all");
  const [filterSetup, setFilterSetup] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique setups for filter
  const uniqueSetups = useMemo(() => {
    const setups = new Set<string>();
    trades.forEach((t) => {
      if (t.setup) setups.add(t.setup);
    });
    return Array.from(setups);
  }, [trades]);

  // Filter and search trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchesSearch =
        searchQuery === "" ||
        trade.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.setup?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDirection =
        filterDirection === "all" || trade.direction === filterDirection;

      const matchesSetup =
        filterSetup === "all" || trade.setup === filterSetup;

      return matchesSearch && matchesDirection && matchesSetup;
    });
  }, [trades, searchQuery, filterDirection, filterSetup]);

  // Pagination
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrades.slice(start, start + itemsPerPage);
  }, [filteredTrades, currentPage]);

  const calculatePnL = (trade: Trade): number | null => {
    if (trade.exit === null) return null;
    const pnl =
      trade.direction === "long"
        ? trade.exit - trade.entry
        : trade.entry - trade.exit;
    return pnl;
  };

  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowDetailModal(true);
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setEditFormData({
      ticker: trade.ticker,
      entry: trade.entry,
      exit: trade.exit,
      direction: trade.direction,
      setup: trade.setup || undefined,
      notes: trade.notes || undefined,
      tags: trade.tags || undefined,
      date: trade.date,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTrade) return;
    try {
      await editTrade(editingTrade.id, editFormData);
      setEditingTrade(null);
      setEditFormData({});
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await removeTrade(id);
      if (selectedTrade?.id === id) {
        setShowDetailModal(false);
        setSelectedTrade(null);
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-muted-foreground">Loading trades...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Trade History
          </h1>
          <p className="text-muted-foreground mt-2">
            View, edit, and manage your trading history
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ticker or setup..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={filterDirection}
                onValueChange={(value) => {
                  setFilterDirection(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterSetup}
                onValueChange={(value) => {
                  setFilterSetup(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Setup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Setups</SelectItem>
                  {uniqueSetups.map((setup) => (
                    <SelectItem key={setup} value={setup}>
                      {setup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                {filteredTrades.length} trade{filteredTrades.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trades</CardTitle>
            <CardDescription>
              Click on a trade to view details and AI feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedTrades.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No trades found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium">Ticker</th>
                        <th className="text-left p-4 text-sm font-medium">Entry</th>
                        <th className="text-left p-4 text-sm font-medium">Exit</th>
                        <th className="text-left p-4 text-sm font-medium">P&L</th>
                        <th className="text-left p-4 text-sm font-medium">Direction</th>
                        <th className="text-left p-4 text-sm font-medium">Setup</th>
                        <th className="text-left p-4 text-sm font-medium">Date</th>
                        <th className="text-right p-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTrades.map((trade) => {
                        const pnl = calculatePnL(trade);
                        return (
                          <tr
                            key={trade.id}
                            className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleViewTrade(trade)}
                          >
                            <td className="p-4 font-medium">{trade.ticker}</td>
                            <td className="p-4">${trade.entry.toFixed(2)}</td>
                            <td className="p-4">
                              {trade.exit ? `$${trade.exit.toFixed(2)}` : "-"}
                            </td>
                            <td className="p-4">
                              {pnl !== null ? (
                                <span
                                  className={
                                    pnl >= 0 ? "text-neon-cyan" : "text-red-500"
                                  }
                                >
                                  {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  trade.direction === "long"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {trade.direction.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4">{trade.setup || "-"}</td>
                            <td className="p-4">
                              {format(new Date(trade.date), "MMM dd, yyyy")}
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTrade(trade);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(trade.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedTrade && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Trade Details: {selectedTrade.ticker}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDetailModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogTitle>
                  <DialogDescription>
                    {format(new Date(selectedTrade.date), "MMMM dd, yyyy")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Price</p>
                      <p className="text-lg font-semibold">${selectedTrade.entry.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Exit Price</p>
                      <p className="text-lg font-semibold">
                        {selectedTrade.exit ? `$${selectedTrade.exit.toFixed(2)}` : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Direction</p>
                      <p className="text-lg font-semibold uppercase">
                        {selectedTrade.direction}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Setup</p>
                      <p className="text-lg font-semibold">
                        {selectedTrade.setup || "-"}
                      </p>
                    </div>
                  </div>

                  {selectedTrade.tags && selectedTrade.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTrade.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTrade.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">
                        {selectedTrade.notes}
                      </p>
                    </div>
                  )}

                  {selectedTrade.ai_feedback && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">AI Feedback</p>
                      <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 p-4 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedTrade.ai_feedback}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEditTrade(selectedTrade);
                        setShowDetailModal(false);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(selectedTrade.id);
                        setShowDetailModal(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={!!editingTrade} onOpenChange={() => setEditingTrade(null)}>
          <DialogContent>
            {editingTrade && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Trade</DialogTitle>
                  <DialogDescription>
                    Update the trade information below
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ticker</label>
                      <Input
                        value={editFormData.ticker || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, ticker: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={editFormData.date || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entry</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFormData.entry || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            entry: parseFloat(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Exit</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFormData.exit || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            exit: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Direction</label>
                      <Select
                        value={editFormData.direction || "long"}
                        onValueChange={(value: "long" | "short") =>
                          setEditFormData({ ...editFormData, direction: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long">Long</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Setup</label>
                      <Input
                        value={editFormData.setup || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            setup: e.target.value || undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditingTrade(null)}
                    >
                      Cancel
                    </Button>
                    <Button variant="neon" onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
