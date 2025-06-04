-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Pressure Pipes', 'High-pressure PVC pipes for water supply systems'),
  ('Fittings', 'Various PVC fittings for pipe connections'),
  ('Valves', 'Control valves for flow management'),
  ('Accessories', 'Additional accessories and components'),
  ('Joints', 'Pipe joints and connectors'),
  ('Couplings', 'Pipe couplings and adapters')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, category, description, specifications, status) VALUES
  (
    'PVC Pressure Pipe 110mm',
    'Pressure Pipes',
    'High-quality PVC pressure pipe suitable for water supply systems.',
    '["Diameter: 110mm", "Pressure Rating: 10 Bar", "Length: 6m", "Material: uPVC"]'::jsonb,
    'active'
  ),
  (
    'PVC Pressure Pipe 160mm',
    'Pressure Pipes',
    'Heavy-duty PVC pressure pipe for industrial applications.',
    '["Diameter: 160mm", "Pressure Rating: 16 Bar", "Length: 6m", "Material: uPVC"]'::jsonb,
    'active'
  ),
  (
    'PVC Elbow 90° - 50mm',
    'Fittings',
    'Durable 90-degree elbow fitting for pipe connections.',
    '["Size: 50mm", "Angle: 90°", "Material: PVC", "Thread Type: Socket"]'::jsonb,
    'active'
  ),
  (
    'PVC Elbow 90° - 75mm',
    'Fittings',
    'Heavy-duty 90-degree elbow fitting for larger pipe connections.',
    '["Size: 75mm", "Angle: 90°", "Material: PVC", "Thread Type: Socket"]'::jsonb,
    'active'
  ),
  (
    'PVC Ball Valve 25mm',
    'Valves',
    'Reliable ball valve for flow control in PVC piping systems.',
    '["Size: 25mm", "Operation: Manual", "Material: PVC", "Pressure: 16 Bar"]'::jsonb,
    'active'
  ),
  (
    'PVC Ball Valve 50mm',
    'Valves',
    'Heavy-duty ball valve for industrial flow control applications.',
    '["Size: 50mm", "Operation: Manual", "Material: PVC", "Pressure: 16 Bar"]'::jsonb,
    'active'
  ),
  (
    'PVC Tee Joint 75mm',
    'Fittings',
    'T-junction fitting for branching pipe connections.',
    '["Size: 75mm", "Type: Equal Tee", "Material: PVC", "Connection: Socket"]'::jsonb,
    'active'
  ),
  (
    'PVC Reducer 75mm x 50mm',
    'Fittings',
    'Pipe reducer for connecting different diameter pipes.',
    '["Inlet: 75mm", "Outlet: 50mm", "Material: PVC", "Type: Concentric"]'::jsonb,
    'active'
  ),
  (
    'PVC End Cap 110mm',
    'Accessories',
    'End cap for sealing pipe ends.',
    '["Size: 110mm", "Material: PVC", "Type: Socket", "Pressure: 10 Bar"]'::jsonb,
    'active'
  ),
  (
    'PVC Coupling 50mm',
    'Couplings',
    'Straight coupling for joining two pipes of same diameter.',
    '["Size: 50mm", "Material: PVC", "Type: Socket", "Length: 100mm"]'::jsonb,
    'active'
  );

-- Insert sample customers
INSERT INTO customers (name, email, phone, company, address) VALUES
  (
    'Rajesh Kumar',
    'rajesh@example.com',
    '+91 98765 43210',
    'Kumar Construction',
    '123 Construction Lane, Mumbai, Maharashtra 400001'
  ),
  (
    'Priya Sharma',
    'priya@techcorp.com',
    '+91 87654 32109',
    'Tech Corp Industries',
    '456 Industrial Area, Pune, Maharashtra 411001'
  ),
  (
    'Amit Patel',
    'amit@builders.com',
    '+91 76543 21098',
    'Patel Builders',
    '789 Builder Street, Ahmedabad, Gujarat 380001'
  )
ON CONFLICT (email) DO NOTHING;

-- Insert sample quotation requests
INSERT INTO quotation_requests (
  customer_name, 
  email, 
  phone, 
  company, 
  items, 
  project_details, 
  status
) VALUES
  (
    'Rajesh Kumar',
    'rajesh@example.com',
    '+91 98765 43210',
    'Kumar Construction',
    '[
      {"product": "PVC Pressure Pipe 110mm", "quantity": 50, "specifications": "10 Bar pressure rating"},
      {"product": "PVC Elbow 90° - 50mm", "quantity": 20, "specifications": "Socket type"}
    ]'::jsonb,
    'Residential complex water supply system installation',
    'pending'
  ),
  (
    'Priya Sharma',
    'priya@techcorp.com',
    '+91 87654 32109',
    'Tech Corp Industries',
    '[
      {"product": "PVC Ball Valve 25mm", "quantity": 10, "specifications": "16 Bar pressure"}
    ]'::jsonb,
    'Industrial facility plumbing upgrade',
    'quoted'
  ),
  (
    'Amit Patel',
    'amit@builders.com',
    '+91 76543 21098',
    'Patel Builders',
    '[
      {"product": "PVC Pressure Pipe 160mm", "quantity": 100, "specifications": "16 Bar pressure rating"},
      {"product": "PVC Tee Joint 75mm", "quantity": 30, "specifications": "Equal tee type"}
    ]'::jsonb,
    'Commercial building water supply infrastructure',
    'pending'
  );
