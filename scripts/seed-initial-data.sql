-- Insert initial categories
INSERT INTO categories (name, description) VALUES
('Drainage Pipes', 'PVC pipes for drainage and sewer systems'),
('Pressure Pipes', 'High-pressure pipes for water supply systems'),
('Pipe Fittings', 'Elbows, tees, reducers and other pipe connections'),
('Valves', 'Ball valves, gate valves and flow control devices'),
('Tools', 'Pipe cutting and installation tools'),
('Adhesives', 'Solvent cements and pipe joining compounds')
ON CONFLICT (name) DO NOTHING;

-- Insert initial products
INSERT INTO products (name, description, price, category, image, featured) VALUES
('PVC Drainage Pipe 110mm', 'High-quality PVC drainage pipe, 110mm diameter, 6-meter length. Perfect for residential and commercial drainage systems.', 45.99, 'Drainage Pipes', '/placeholder.svg?height=300&width=300&text=PVC+Pipe+110mm', true),
('PVC Elbow Joint 90°', 'Durable 90-degree elbow joint for PVC pipes. Available in multiple sizes for various plumbing applications.', 8.99, 'Pipe Fittings', '/placeholder.svg?height=300&width=300&text=Elbow+Joint', false),
('PVC Ball Valve 25mm', 'Premium quality ball valve with lever handle. Suitable for water supply and irrigation systems.', 24.99, 'Valves', '/placeholder.svg?height=300&width=300&text=Ball+Valve', true),
('PVC Pressure Pipe 50mm', 'High-pressure PVC pipe for water supply systems. Meets Australian standards for potable water.', 32.99, 'Pressure Pipes', '/placeholder.svg?height=300&width=300&text=Pressure+Pipe', false),
('PVC T-Junction', 'Three-way T-junction fitting for connecting multiple pipe sections. Available in various sizes.', 12.99, 'Pipe Fittings', '/placeholder.svg?height=300&width=300&text=T-Junction', false),
('PVC Pipe Cutter', 'Professional-grade pipe cutter for clean, precise cuts on PVC pipes up to 63mm diameter.', 89.99, 'Tools', '/placeholder.svg?height=300&width=300&text=Pipe+Cutter', true),
('PVC Solvent Cement', 'High-strength solvent cement for permanent PVC pipe joints. Fast-setting formula for quick installation.', 16.99, 'Adhesives', '/placeholder.svg?height=300&width=300&text=Solvent+Cement', false),
('PVC Reducer Coupling', 'Reducer coupling for connecting pipes of different diameters. Available in multiple size combinations.', 9.99, 'Pipe Fittings', '/placeholder.svg?height=300&width=300&text=Reducer', false);
