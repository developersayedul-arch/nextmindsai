-- Follow-up reminders table
CREATE TABLE public.follow_up_reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    reminder_type text NOT NULL DEFAULT 'whatsapp',
    notes text,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by uuid,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.follow_up_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for follow_up_reminders
CREATE POLICY "Admins can view all reminders" 
ON public.follow_up_reminders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert reminders" 
ON public.follow_up_reminders 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reminders" 
ON public.follow_up_reminders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reminders" 
ON public.follow_up_reminders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Mentorship sessions table
CREATE TABLE public.mentorship_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    mentor_name text NOT NULL DEFAULT 'SA Coder Expert',
    session_type text NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes integer NOT NULL DEFAULT 60,
    status text NOT NULL DEFAULT 'pending',
    whatsapp_number text NOT NULL,
    business_idea text,
    topics text[],
    notes text,
    meeting_link text,
    price numeric NOT NULL DEFAULT 499,
    payment_status text NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for mentorship_sessions
CREATE POLICY "Users can view own sessions" 
ON public.mentorship_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert sessions" 
ON public.mentorship_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own sessions" 
ON public.mentorship_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
ON public.mentorship_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all sessions" 
ON public.mentorship_sessions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sessions" 
ON public.mentorship_sessions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Mentorship messages for chat
CREATE TABLE public.mentorship_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES public.mentorship_sessions(id) ON DELETE CASCADE,
    sender_type text NOT NULL,
    message text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentorship_messages ENABLE ROW LEVEL SECURITY;

-- Policies for mentorship_messages
CREATE POLICY "Users can view session messages" 
ON public.mentorship_messages 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.mentorship_sessions 
        WHERE id = session_id AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
);

CREATE POLICY "Anyone can insert messages" 
ON public.mentorship_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can delete messages" 
ON public.mentorship_messages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_follow_up_reminders_updated_at
BEFORE UPDATE ON public.follow_up_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
BEFORE UPDATE ON public.mentorship_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();