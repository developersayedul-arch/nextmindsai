import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Phone, 
  Video,
  CalendarDays
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from "date-fns";
import { bn } from "date-fns/locale";

interface MentorshipSession {
  id: string;
  user_id: string | null;
  mentor_name: string;
  session_type: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  whatsapp_number: string;
  business_idea: string | null;
  topics: string[] | null;
  notes: string | null;
  meeting_link: string | null;
  price: number;
  payment_status: string;
  created_at: string;
}

const sessionTypes: Record<string, { label: string; color: string }> = {
  "business-idea": { label: "বিজনেস আইডিয়া", color: "bg-blue-500" },
  "marketing": { label: "মার্কেটিং", color: "bg-purple-500" },
  "scaling": { label: "স্কেলিং", color: "bg-green-500" },
  "full-consultation": { label: "সম্পূর্ণ প্ল্যান", color: "bg-orange-500" },
  "tech-guidance": { label: "টেক গাইড", color: "bg-cyan-500" }
};

interface MentorshipCalendarProps {
  sessions: MentorshipSession[];
  onSessionClick?: (session: MentorshipSession) => void;
}

const MentorshipCalendar = ({ sessions, onSessionClick }: MentorshipCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

  const sessionsMap = useMemo(() => {
    const map = new Map<string, MentorshipSession[]>();
    sessions.forEach(session => {
      const dateKey = format(new Date(session.session_date), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(session);
    });
    return map;
  }, [sessions]);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
  }, [currentMonth]);

  const getSessionsForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return sessionsMap.get(dateKey) || [];
  };

  const handleDateClick = (date: Date) => {
    const daySessions = getSessionsForDate(date);
    if (daySessions.length > 0) {
      setSelectedDate(date);
      setShowDayDialog(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 text-xs">নিশ্চিত</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 text-xs">সম্পন্ন</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="text-xs">বাতিল</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">পেন্ডিং</Badge>;
    }
  };

  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const weekDays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            সেশন ক্যালেন্ডার
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[150px] text-center">
              {format(currentMonth, "MMMM yyyy", { locale: bn })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 bg-muted/30 rounded-lg" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const daySessions = getSessionsForDate(day);
            const hasConfirmed = daySessions.some(s => s.status === "confirmed");
            const hasPending = daySessions.some(s => s.status === "pending");

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`h-24 p-1 rounded-lg border transition-colors cursor-pointer ${
                  isToday(day) 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                } ${daySessions.length > 0 ? "hover:bg-accent" : ""}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${isToday(day) ? "text-primary" : ""}`}>
                    {format(day, "d")}
                  </span>
                  {daySessions.length > 0 && (
                    <span className={`w-2 h-2 rounded-full ${
                      hasConfirmed ? "bg-green-500" : hasPending ? "bg-orange-500" : "bg-muted"
                    }`} />
                  )}
                </div>
                
                {/* Session indicators */}
                <div className="space-y-0.5 overflow-hidden">
                  {daySessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className={`text-xs px-1 py-0.5 rounded truncate text-white ${
                        sessionTypes[session.session_type]?.color || "bg-gray-500"
                      }`}
                    >
                      {format(new Date(session.session_date), "HH:mm")}
                    </div>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{daySessions.length - 3} আরও
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
          {Object.entries(sessionTypes).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${value.color}`} />
              <span className="text-xs text-muted-foreground">{value.label}</span>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Day Sessions Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: bn })} - সেশনসমূহ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
            {selectedDate && getSessionsForDate(selectedDate).map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  onSessionClick?.(session);
                  setShowDayDialog(false);
                }}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(new Date(session.session_date), "HH:mm")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({session.duration_minutes} মিনিট)
                    </span>
                  </div>
                  {getStatusBadge(session.status)}
                </div>
                
                <div className={`inline-block px-2 py-1 rounded text-xs text-white mb-2 ${
                  sessionTypes[session.session_type]?.color || "bg-gray-500"
                }`}>
                  {sessionTypes[session.session_type]?.label || session.session_type}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <a
                    href={`https://wa.me/88${session.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3 w-3" />
                    {session.whatsapp_number}
                  </a>
                  <span className="font-medium text-primary">৳{session.price}</span>
                </div>

                {session.meeting_link && (
                  <a
                    href={session.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:underline text-sm mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Video className="h-3 w-3" />
                    মিটিং জয়েন করুন
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MentorshipCalendar;
