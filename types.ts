export interface PricePoint {
  price: number;
  timestamp: string;
}

export type ManufacturingStage = 'FORGING' | 'MACHINING' | 'POLISHING' | 'CLEANING' | 'QC' | 'STERILIZATION' | 'PACKED';
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface QCRecord {
  inspectorId: string;
  timestamp: string;
  status: 'PASSED' | 'REJECTED' | 'REWORK';
  notes: string;
}

export interface StockBatch {
  id: string;
  productId: string;
  mfgDate: string;
  quantity: number;
  location: string; // Aisle-Rack-Shelf-Bin
  stage: ManufacturingStage;
  rawMaterialSource?: string;
  qcHistory: QCRecord[];
  isRecalled?: boolean;
}

export interface WarehouseLocation {
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface DeliveryRecord {
  id: string;
  orderId: string;
  doctorName: string;
  status: 'QUEUED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  eta: string;
  whatsappLink?: string;
  lastUpdate: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  specialty?: string;
  stock: number;
  reservedStock?: number;
  safetyStock: number; // For legacy UI logic
  minimum_threshold: number; // New ERP rule field
  stock_status: StockStatus; // New ERP rule field
  price: number;
  margin?: number;
  warehouseLocation: WarehouseLocation;
  warehouseIdentity?: string; // Unique ID for warehouse wayfinding
  lastUpdated: string;
  imageUrl?: string;
  priceHistory?: PricePoint[];
  batches?: StockBatch[];
  velocity?: number;
  specs?: string[];
  description?: string;
}

export interface Transaction {
  id: string;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  gstAmount: number;
  total: number;
  customerName: string;
  customerGst?: string;
  timestamp: string;
  synced: boolean;
}

export interface Quotation {
  id: string;
  setName: string;
  items: { product: Product; quantity: number }[];
  total: number;
  validUntil: string;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinDate: string;
}

export type ViewState = 'DASHBOARD' | 'INVENTORY' | 'BILLING' | 'INVOICES' | 'QUOTATIONS' | 'DELIVERY' | 'ADMIN' | 'PRODUCTION' | 'RECALL';

export interface CommandParseResult {
  action: 'ADD' | 'REMOVE' | 'UPDATE_PRICE' | 'SET_MARGIN' | 'DISPATCH' | 'CHECK_STOCK' | 'ASSEMBLE_SET' | 'MOVE_STAGE' | 'LOCATE' | 'UNKNOWN';
  item: string;
  quantity?: number;
  price?: number;
  margin?: number;
  target?: string;
  stage?: ManufacturingStage;
  originalText: string;
}