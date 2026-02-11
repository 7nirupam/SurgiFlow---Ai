
import { Product, Transaction, AuthUser, StockBatch, ManufacturingStage, Quotation, StockStatus, DeliveryRecord } from './types';

const LATENCY = 400;

class SurgiFlowAPI {
  private calculateStatus(stock: number, threshold: number): StockStatus {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= threshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  private getStorage<T>(key: string, initial: T): T {
    const saved = localStorage.getItem(`surgiflow_${key}`);
    return saved ? JSON.parse(saved) : initial;
  }

  private setStorage<T>(key: string, data: T): void {
    localStorage.setItem(`surgiflow_${key}`, JSON.stringify(data));
  }

  private initializeSeedData() {
    // Inventory Seed
    const currentInv = localStorage.getItem('surgiflow_inventory');
    if (!currentInv || JSON.parse(currentInv).length === 0) {
      const seed: Product[] = [
        {
          id: 'SF-001',
          sku: 'SURG-MET-001',
          name: 'Micro-Scalpel Elite 45',
          category: 'Scalpels',
          specialty: 'Plastic Surgery',
          stock: 145,
          safetyStock: 30,
          minimum_threshold: 40,
          stock_status: 'IN_STOCK',
          price: 12.50,
          warehouseLocation: { aisle: 'A', rack: '01', shelf: '02', bin: 'A1' },
          warehouseIdentity: 'WH-A01-02A1-001',
          lastUpdated: new Date().toISOString(),
          batches: [
            { id: 'BATCH-2024-001', productId: 'SF-001', mfgDate: '2024-01-15', quantity: 100, location: 'A-01-02-A1', stage: 'PACKED', qcHistory: [] },
            { id: 'BATCH-2024-002', productId: 'SF-001', mfgDate: '2024-02-20', quantity: 45, location: 'A-01-02-A1', stage: 'PACKED', qcHistory: [] }
          ],
          priceHistory: [{ price: 12.50, timestamp: new Date().toISOString() }],
          velocity: 1.2
        },
        {
          id: 'SF-002',
          sku: 'SURG-MET-002',
          name: 'Adson Forceps (Toothed)',
          category: 'Forceps',
          specialty: 'General Surgery',
          stock: 8,
          safetyStock: 15,
          minimum_threshold: 20,
          stock_status: 'LOW_STOCK',
          price: 45.00,
          warehouseLocation: { aisle: 'B', rack: '04', shelf: '01', bin: 'C3' },
          warehouseIdentity: 'WH-B04-01C3-002',
          lastUpdated: new Date().toISOString(),
          batches: [
            { id: 'BATCH-2023-442', productId: 'SF-002', mfgDate: '2023-11-05', quantity: 8, location: 'B-04-01-C3', stage: 'PACKED', qcHistory: [] }
          ],
          priceHistory: [{ price: 45.00, timestamp: new Date().toISOString() }],
          velocity: 0.8
        },
        {
          id: 'SF-003',
          sku: 'SURG-CRV-003',
          name: 'Curved Artery Forceps',
          category: 'Forceps',
          specialty: 'General Surgery',
          stock: 0,
          safetyStock: 10,
          minimum_threshold: 15,
          stock_status: 'OUT_OF_STOCK',
          price: 32.00,
          warehouseLocation: { aisle: 'C', rack: '02', shelf: '04', bin: 'B2' },
          warehouseIdentity: 'WH-C02-04B2-003',
          lastUpdated: new Date().toISOString(),
          batches: [],
          priceHistory: [{ price: 32.00, timestamp: new Date().toISOString() }],
          velocity: 2.1
        }
      ];
      this.setStorage('inventory', seed);
    }

    // Deliveries Seed
    const currentDeliv = localStorage.getItem('surgiflow_deliveries');
    if (!currentDeliv || JSON.parse(currentDeliv).length === 0) {
      const delivSeed: DeliveryRecord[] = [
        {
          id: 'LOG-AX92',
          orderId: 'ORD-9921',
          doctorName: 'Mayo Clinic - Surgery Unit 4',
          status: 'DISPATCHED',
          eta: '12 mins',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'LOG-BT44',
          orderId: 'ORD-8842',
          doctorName: 'St. Jude Children Hospital',
          status: 'OUT_FOR_DELIVERY',
          eta: '4 mins',
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'LOG-ZC01',
          orderId: 'ORD-7712',
          doctorName: 'Cleveland Clinic Foundation',
          status: 'DELIVERED',
          eta: 'Arrived',
          lastUpdate: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      this.setStorage('deliveries', delivSeed);
    }

    // WIP Seed
    const currentWIP = localStorage.getItem('surgiflow_wip');
    if (!currentWIP) {
      const wipSeed: StockBatch[] = [
        { id: 'WIP-101', productId: 'SF-001', mfgDate: new Date().toISOString(), quantity: 50, location: 'ZONE-FORGE', stage: 'FORGING', rawMaterialSource: 'Titanium-A12', qcHistory: [] },
        { id: 'WIP-102', productId: 'SF-002', mfgDate: new Date().toISOString(), quantity: 30, location: 'ZONE-CLEAN', stage: 'CLEANING', rawMaterialSource: 'Steel-316L', qcHistory: [] }
      ];
      this.setStorage('wip', wipSeed);
    }
  }

  constructor() {
    this.initializeSeedData();
  }

  async getProducts(): Promise<Product[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    const raw = this.getStorage<Product[]>('inventory', []);
    return raw.map(p => ({
      ...p,
      stock_status: this.calculateStatus(p.stock, p.minimum_threshold)
    }));
  }

  async updateProduct(product: Product): Promise<void> {
    await new Promise(r => setTimeout(r, LATENCY));
    const products = this.getStorage<Product[]>('inventory', []);
    const status = this.calculateStatus(product.stock, product.minimum_threshold);
    const updatedProduct = { ...product, stock_status: status, lastUpdated: new Date().toISOString() };
    
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = updatedProduct;
    } else {
      products.push(updatedProduct);
    }
    this.setStorage('inventory', products);
  }

  async getDeliveries(): Promise<DeliveryRecord[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    return this.getStorage<DeliveryRecord[]>('deliveries', []);
  }

  async saveDeliveries(deliveries: DeliveryRecord[]): Promise<void> {
    await new Promise(r => setTimeout(r, LATENCY));
    this.setStorage('deliveries', deliveries);
  }

  async getTransactions(): Promise<Transaction[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    return this.getStorage<Transaction[]>('txs', []);
  }

  async saveTransaction(tx: Transaction): Promise<void> {
    await new Promise(r => setTimeout(r, LATENCY));
    const txs = this.getStorage<Transaction[]>('txs', []);
    this.setStorage('txs', [tx, ...txs]);
    const products = this.getStorage<Product[]>('inventory', []);
    tx.items.forEach(item => {
      const p = products.find(prod => prod.id === item.product.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        p.stock_status = this.calculateStatus(p.stock, p.minimum_threshold);
        p.velocity = (p.velocity || 1) + 0.1;
      }
    });
    this.setStorage('inventory', products);
  }

  async getQuotations(): Promise<Quotation[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    return this.getStorage<Quotation[]>('quotations', []);
  }

  async saveQuotation(quote: Quotation): Promise<void> {
    await new Promise(r => setTimeout(r, LATENCY));
    const quotes = this.getStorage<Quotation[]>('quotations', []);
    this.setStorage('quotations', [quote, ...quotes]);
  }

  async getWIPBatches(): Promise<StockBatch[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    return this.getStorage<StockBatch[]>('wip', []);
  }

  async updateBatch(batch: StockBatch): Promise<void> {
    await new Promise(r => setTimeout(r, LATENCY));
    let wip = this.getStorage<StockBatch[]>('wip', []);
    const idx = wip.findIndex(b => b.id === batch.id);
    if (idx !== -1) {
      wip[idx] = batch;
    } else {
      wip.push(batch);
    }
    this.setStorage('wip', wip);

    if (batch.stage === 'PACKED') {
      const products = this.getStorage<Product[]>('inventory', []);
      const p = products.find(prod => prod.id === batch.productId);
      if (p) {
        p.stock += batch.quantity;
        p.stock_status = this.calculateStatus(p.stock, p.minimum_threshold);
        p.batches = [...(p.batches || []), batch];
        this.setStorage('inventory', products);
        this.setStorage('wip', wip.filter(b => b.id !== batch.id));
      }
    }
  }

  async getUsers(): Promise<AuthUser[]> {
    await new Promise(r => setTimeout(r, LATENCY));
    return this.getStorage<AuthUser[]>('users', [
      { id: '1', email: 'admin@surgiflow.com', name: 'Dr. Aris Thorne', role: 'ADMIN', status: 'ACTIVE', joinDate: new Date().toISOString() }
    ]);
  }
}

export const api = new SurgiFlowAPI();
