import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Receipt, FileText, ClipboardList,
  Truck, ShieldCheck, RotateCcw,
  LogOut, Menu, X, Sparkles, Mic
} from 'lucide-react';
import { Product, Transaction, AuthUser, ViewState, StockBatch, DeliveryRecord, Quotation } from './types';
import { api } from './api';

// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Billing from './components/Billing';
import Invoices from './components/Invoices';
import Quotations from './components/Quotations';
import DeliveryModule from './components/DeliveryModule';
import AdminPanel from './components/AdminPanel';
import ProductionHub from './components/ProductionHub';
import RecallCenter from './components/RecallCenter';
import VoiceNeuralInterface from './components/VoiceNeuralInterface';
import UniversalVoiceController from './components/UniversalVoiceController';
import StockAlertSystem from './components/StockAlertSystem';

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [wipBatches, setWipBatches] = useState<StockBatch[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  // Cross-module navigation state
  const [autoLocateProductId, setAutoLocateProductId] = useState<string | null>(null);
  const [preselectedProduct, setPreselectedProduct] = useState<Product | null>(null);

  // Voice Neural Interface state
  const [isVoiceInterfaceOpen, setIsVoiceInterfaceOpen] = useState(false);
  const [isUniversalVoiceOpen, setIsUniversalVoiceOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const roles = ['ADMIN', 'STAFF', 'MANAGER', 'OPERATOR'];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const [prods, txs, usrs, wip, delivs, quotes] = await Promise.all([
      api.getProducts(),
      api.getTransactions(),
      api.getUsers(),
      api.getWIPBatches(),
      api.getDeliveries(),
      api.getQuotations()
    ]);
    setProducts(prods);
    setTransactions(txs);
    setUsers(usrs);
    setWipBatches(wip);
    setDeliveries(delivs);
    setQuotations(quotes);
  };

  const handleLogin = (loggedInUser: AuthUser) => {
    console.log('App.tsx handleLogin called with:', loggedInUser);
    setUser(loggedInUser);
    console.log('User state set to:', loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('DASHBOARD');
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleProductUpdate = async (product: Product) => {
    await api.updateProduct(product);
    loadData();
  };

  const handleTransactionSave = async (tx: Transaction) => {
    await api.saveTransaction(tx);
    loadData();
  };

  const handleQuotationSave = async (quote: Quotation) => {
    await api.saveQuotation(quote);
    loadData();
  };

  const handleBatchUpdate = async (batch: StockBatch) => {
    await api.updateBatch(batch);
    loadData();
  };

  const handleDeliveriesSave = async (delivs: DeliveryRecord[]) => {
    await api.saveDeliveries(delivs);
    setDeliveries(delivs);
  };

  // Voice Command Handlers
  const handleVoiceExecute = async (action: string, productId: string, qty: number, price?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (action === 'ADD') {
      await handleProductUpdate({ ...product, stock: product.stock + qty });
    } else if (action === 'REMOVE') {
      await handleProductUpdate({ ...product, stock: Math.max(0, product.stock - qty) });
    } else if (action === 'UPDATE_PRICE' && price) {
      await handleProductUpdate({ ...product, price });
    }
  };

  const handleVoiceLocate = (productId: string) => {
    setAutoLocateProductId(productId);
    setCurrentView('INVENTORY');
  };

  // Stock Alert Handlers
  const handleDeployBatch = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    await handleProductUpdate({ ...product, stock: product.stock + quantity });
  };

  const handleStockAlertLocate = (productId: string) => {
    setAutoLocateProductId(productId);
    setCurrentView('INVENTORY');
  };

  // Universal Voice Controller Handlers
  const handleUniversalInventoryUpdate = async (itemIdOrName: string, quantity: number, action: 'ADD' | 'REMOVE') => {
    // Check if it's an existing product ID
    let product = products.find(p => p.id === itemIdOrName);

    if (!product) {
      // Try fuzzy match by name
      product = products.find(p =>
        p.name.toLowerCase().includes(itemIdOrName.toLowerCase()) ||
        itemIdOrName.toLowerCase().includes(p.name.toLowerCase())
      );
    }

    if (product) {
      // Update existing product
      const newStock = action === 'ADD'
        ? product.stock + quantity
        : Math.max(0, product.stock - quantity);

      await handleProductUpdate({ ...product, stock: newStock });
    } else {
      // Create new product
      const id = `SF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const newProduct: Product = {
        id,
        sku: `SKU-${id}`,
        name: itemIdOrName,
        category: 'General',
        stock: quantity,
        safetyStock: 10,
        minimum_threshold: 10,
        stock_status: 'IN_STOCK',
        price: 0,
        warehouseLocation: { aisle: 'A', rack: '01', shelf: '01', bin: '01' },
        lastUpdated: new Date().toISOString(),
        priceHistory: []
      };
      await handleProductUpdate(newProduct);
    }
  };

  const handleUniversalCartAction = (action: string, item?: string) => {
    // Navigate to billing for cart actions
    if (action === 'ADD_TO_CART' || action === 'CHECKOUT' || action === 'GENERATE_BILL') {
      setCurrentView('BILLING');

      // If item specified, try to preselect it
      if (item) {
        const product = products.find(p =>
          p.name.toLowerCase().includes(item.toLowerCase()) ||
          item.toLowerCase().includes(p.name.toLowerCase())
        );
        if (product) {
          setPreselectedProduct(product);
        }
      }
    }
  };


  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'INVENTORY', label: 'Inventory', icon: Package },
    { id: 'BILLING', label: 'Billing', icon: Receipt },
    { id: 'INVOICES', label: 'Invoices', icon: FileText },
    { id: 'QUOTATIONS', label: 'Quotations', icon: ClipboardList },
    { id: 'DELIVERY', label: 'Delivery', icon: Truck },
    { id: 'PRODUCTION', label: 'Production', icon: RotateCcw },
    { id: 'RECALL', label: 'Recall Center', icon: RotateCcw },
    ...(user?.role === 'ADMIN' ? [{ id: 'ADMIN', label: 'Admin', icon: ShieldCheck }] : [])
  ];


  console.log('App render - user state:', user);

  if (!user) {
    console.log('No user - showing Auth component');
    return <Auth onLogin={handleLogin} />;
  }

  console.log('User logged in - showing Dashboard');

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">SurgiFlow</h1>
              <p className="text-xs text-slate-500">AI Enterprise</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id as ViewState)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="px-4 py-3 mb-2 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-2xl font-black text-slate-900">
              {navItems.find(item => item.id === currentView)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'DASHBOARD' && (
            <Dashboard
              products={products}
              transactions={transactions}
              wipBatches={wipBatches}
              onNavigate={handleViewChange}
            />
          )}
          {currentView === 'INVENTORY' && (
            <Inventory
              products={products}
              onUpdate={handleProductUpdate}
              autoLocateProductId={autoLocateProductId}
              onClearLocate={() => setAutoLocateProductId(null)}
              onTerminalPush={(p) => {
                setPreselectedProduct(p);
                handleViewChange('BILLING');
              }}
            />
          )}
          {currentView === 'BILLING' && (
            <Billing
              products={products}
              transactions={transactions}
              onSave={handleTransactionSave}
              isOnline={true}
              onSync={() => { }}
              preselectedProduct={preselectedProduct}
              onClearPreselected={() => setPreselectedProduct(null)}
              onLocate={(id) => {
                setAutoLocateProductId(id);
                handleViewChange('INVENTORY');
              }}
            />
          )}
          {currentView === 'INVOICES' && (
            <Invoices transactions={transactions} />
          )}
          {currentView === 'QUOTATIONS' && (
            <Quotations
              products={products}
              quotations={quotations}
              onSave={handleQuotationSave}
            />
          )}
          {currentView === 'DELIVERY' && (
            <DeliveryModule
              deliveries={deliveries}
              setDeliveries={handleDeliveriesSave}
            />
          )}
          {currentView === 'PRODUCTION' && (
            <ProductionHub
              products={products}
              wipBatches={wipBatches}
              transactions={transactions}
              onUpdateBatch={handleBatchUpdate}
            />
          )}
          {currentView === 'RECALL' && (
            <RecallCenter transactions={transactions} products={products} />
          )}
          {currentView === 'ADMIN' && user.role === 'ADMIN' && (
            <AdminPanel
              products={products}
              transactions={transactions}
              users={users}
              roles={roles}
              onUpdateProduct={handleProductUpdate}
              onToggleUserStatus={async (id) => {
                const updatedUsers = users.map(u =>
                  u.id === id ? { ...u, status: (u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE') as 'ACTIVE' | 'SUSPENDED' } : u
                );
                setUsers(updatedUsers);
              }}
              onUpdateUserRole={(id, role) => {
                const updatedUsers = users.map(u =>
                  u.id === id ? { ...u, role } : u
                );
                setUsers(updatedUsers);
              }}
              onAddRole={(name) => {
                // Role management logic
              }}
              onRemoveRole={(name) => {
                // Role management logic
              }}
            />
          )}
        </main>
      </div>

      {/* Persistent Universal Voice FAB - Always Visible */}
      <button
        onClick={() => setIsUniversalVoiceOpen(true)}
        className="fixed bottom-6 right-6 z-[9994] w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-full shadow-2xl flex flex-col items-center justify-center hover:shadow-emerald-500/50 transition-all active:scale-90 group"
        title="Universal Voice Control"
      >
        <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Voice</span>
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
      </button>

      {/* Legacy Voice Neural Interface (for specific inventory actions) */}
      {isVoiceInterfaceOpen && (
        <VoiceNeuralInterface
          onClose={() => setIsVoiceInterfaceOpen(false)}
          onExecute={handleVoiceExecute}
          onLocate={handleVoiceLocate}
          products={products}
        />
      )}

      {/* Universal Voice Controller (for all app navigation and control) */}
      {isUniversalVoiceOpen && (
        <UniversalVoiceController
          isOpen={isUniversalVoiceOpen}
          onClose={() => setIsUniversalVoiceOpen(false)}
          onNavigate={(view) => {
            setCurrentView(view);
            if (window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }}
          onInventoryUpdate={handleUniversalInventoryUpdate}
          onCartAction={handleUniversalCartAction}
          products={products}
          isMuted={isAudioMuted}
          onToggleMute={() => setIsAudioMuted(!isAudioMuted)}
        />
      )}

      {/* Stock Alert System */}
      <StockAlertSystem
        products={products}
        onDeployBatch={handleDeployBatch}
        onLocate={handleStockAlertLocate}
      />
    </div>
  );
};

export default App;