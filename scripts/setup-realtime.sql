-- Enable realtime for tables that need live updates
-- This allows the client dashboard to update in real-time

-- Enable realtime for products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Enable realtime for quotation_requests table  
ALTER PUBLICATION supabase_realtime ADD TABLE quotation_requests;

-- Enable realtime for follow_ups table
ALTER PUBLICATION supabase_realtime ADD TABLE follow_ups;

-- Enable realtime for categories table
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

-- Create a function to notify when new quotations are received
CREATE OR REPLACE FUNCTION notify_new_quotation()
RETURNS TRIGGER AS $$
BEGIN
  -- This will send a realtime notification
  PERFORM pg_notify('new_quotation', json_build_object(
    'id', NEW.id,
    'customer_name', NEW.customer_name,
    'product_id', NEW.product_id,
    'created_at', NEW.created_at
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new quotations
DROP TRIGGER IF EXISTS trigger_notify_new_quotation ON quotation_requests;
CREATE TRIGGER trigger_notify_new_quotation
  AFTER INSERT ON quotation_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_quotation();
