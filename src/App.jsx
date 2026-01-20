import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map, Calendar, User, ShoppingBag, Home, Search, 
  Heart, MapPin, Clock, ChevronRight, Star, 
  Filter, Award, LogOut, Ticket, Settings,
  Plus, Trash2, Save, X, Lock, CheckCircle, Edit2
} from 'lucide-react';

/**
 * DADOS INICIAIS (Seeds)
 */

const CATEGORIES = [
  { id: 'cabelo', label: 'Cabelo', color: 'bg-rose-100 text-rose-700' },
  { id: 'estetica', label: 'Estética', color: 'bg-teal-100 text-teal-700' },
  { id: 'unhas', label: 'Unhas', color: 'bg-purple-100 text-purple-700' },
  { id: 'barbearia', label: 'Barbearia', color: 'bg-slate-100 text-slate-700' },
  { id: 'maquiagem', label: 'Maquiagem', color: 'bg-pink-100 text-pink-700' }
];

const INITIAL_EXHIBITORS = [
  { id: 1, name: 'Loreal Pro', category: 'cabelo', booth: 'A-10', description: 'Tecnologia avançada para tratamento capilar profissional.', isSponsor: true, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Wella Professionals', category: 'cabelo', booth: 'A-12', description: 'Cores vibrantes e cuidados excepcionais.', isSponsor: true, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Vult Cosmética', category: 'maquiagem', booth: 'B-05', description: 'Maquiagem acessível e de alta qualidade.', isSponsor: false, image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=200' },
  { id: 4, name: 'Barba de Respeito', category: 'barbearia', booth: 'C-01', description: 'Produtos masculinos para barba e cabelo.', isSponsor: false, image: 'https://images.unsplash.com/photo-1621607512214-68297f3190ef?auto=format&fit=crop&q=80&w=200' },
  { id: 5, name: 'Risqué', category: 'unhas', booth: 'D-08', description: 'A marca líder em esmaltes no Brasil.', isSponsor: false, image: 'https://images.unsplash.com/photo-1632515904838-8e653303cb52?auto=format&fit=crop&q=80&w=200' },
  { id: 6, name: 'Adcos', category: 'estetica', booth: 'B-15', description: 'Dermocosméticos para tratamento profissional.', isSponsor: true, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200' },
];

const INITIAL_SCHEDULE = [
  { id: 1, title: 'Tendências de Corte 2026', time: '10:00', speaker: 'Rodrigo Cintra', location: 'Palco Principal', category: 'cabelo' },
  { id: 2, title: 'Gestão de Salão: Lucratividade', time: '11:30', speaker: 'Sebrae', location: 'Auditório 2', category: 'negocios' },
  { id: 3, title: 'Colorimetria Avançada', time: '14:00', speaker: 'Romeu Felipe', location: 'Palco Principal', category: 'cabelo' },
  { id: 4, title: 'Barbearia Clássica x Moderna', time: '15:30', speaker: 'Seu Elias', location: 'Workshop Arena', category: 'barbearia' },
  { id: 5, title: 'Biossegurança em Estética', time: '17:00', speaker: 'Dra. Ana Silva', location: 'Auditório 1', category: 'estetica' },
];

const INITIAL_OFFERS = [
  { id: 1, title: 'Kit Reconstrução c/ 40% OFF', exhibitorId: 1, exhibitorName: 'Loreal Pro', discount: '40%', code: 'BEAUTY40', expires: '2h 15m' },
  { id: 2, title: 'Compre 3 Leve 4 Esmaltes', exhibitorId: 5, exhibitorName: 'Risqué', discount: '25%', code: 'UNHAS25', expires: '4h 00m' },
  { id: 3, title: 'Combo Barber Shop', exhibitorId: 4, exhibitorName: 'Barba de Respeito', discount: '30%', code: 'BARBA30', expires: '1h 30m' },
];

/**
 * COMPONENTES UTILITÁRIOS
 */

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, type = "button" }) => {
  const baseStyle = "w-full py-3 rounded-xl font-medium flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-200",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    outline: "border-2 border-rose-500 text-rose-600 bg-transparent",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className} ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}>
    {children}
  </div>
);

const CategoryBadge = ({ categoryId }) => {
  const cat = CATEGORIES.find(c => c.id === categoryId) || { label: categoryId, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${cat.color}`}>
      {cat.label}
    </span>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">{label}</label>
    <input 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
      {...props}
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">{label}</label>
    <select 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

/**
 * TELAS DO APLICATIVO
 */

// 1. TELA INICIAL (HOME)
const HomeScreen = ({ onChangeScreen, userInterests, exhibitors }) => {
  const recommendedExhibitors = useMemo(() => {
    if (!userInterests || userInterests.length === 0) return exhibitors.slice(0, 3);
    return exhibitors.filter(ex => userInterests.includes(ex.category)).slice(0, 3);
  }, [userInterests, exhibitors]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header / Banner */}
      <div className="relative h-48 bg-gray-900 rounded-b-3xl overflow-hidden -mx-4 -mt-4 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800" 
          className="w-full h-full object-cover opacity-60"
          alt="Banner Evento"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col justify-end p-6">
          <span className="text-rose-400 font-bold tracking-wider text-xs uppercase mb-1">20 a 23 de Outubro</span>
          <h1 className="text-white text-2xl font-bold">Maceió Beauty & Hair</h1>
          <p className="text-gray-300 text-sm">O maior evento de beleza do Nordeste.</p>
        </div>
      </div>

      {/* Menu Rápido */}
      <div className="grid grid-cols-4 gap-2 px-2">
        {[
          { icon: Map, label: 'Mapa', screen: 'map' },
          { icon: Calendar, label: 'Agenda', screen: 'schedule' },
          { icon: ShoppingBag, label: 'Expositores', screen: 'exhibitors' },
          { icon: Ticket, label: 'Ofertas', screen: 'offers' },
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => onChangeScreen(item.screen)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <item.icon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Matching: Recomendados para você */}
      <div className="px-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Recomendados para Você</h2>
          <button onClick={() => onChangeScreen('exhibitors')} className="text-rose-600 text-sm font-medium">Ver todos</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {recommendedExhibitors.map(ex => (
            <div key={ex.id} className="min-w-[160px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
              <div className="h-24 bg-gray-200 relative">
                <img src={ex.image} className="w-full h-full object-cover" alt={ex.name} />
                {ex.isSponsor && <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">TOP</span>}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm truncate">{ex.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Stand {ex.booth}</p>
                <CategoryBadge categoryId={ex.category} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Publicidade */}
      <div className="px-2">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-indigo-200">
          <div>
            <p className="font-bold text-lg">Curso Master Class</p>
            <p className="text-indigo-100 text-xs mb-2">Com certificado internacional</p>
            <button className="bg-white text-indigo-600 text-xs px-3 py-1.5 rounded-lg font-bold">Inscrever-se</button>
          </div>
          <Award size={48} className="text-indigo-300 opacity-50" />
        </div>
      </div>
    </div>
  );
};

// 2. TELA DE EXPOSITORES
const ExhibitorsScreen = ({ exhibitors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = exhibitors.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 animate-fade-in">
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Expositores</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar marca ou stand..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filtered.map(ex => (
          <Card key={ex.id} className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
               <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{ex.name}</h3>
                {ex.isSponsor && <Star size={14} className="text-yellow-400 fill-current" />}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{ex.description}</p>
              <div className="flex items-center justify-between">
                <CategoryBadge categoryId={ex.category} />
                <span className="text-xs font-bold text-gray-400 flex items-center">
                  <MapPin size={12} className="mr-1" /> {ex.booth}
                </span>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum expositor encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

// 3. TELA DE AGENDA
const ScheduleScreen = ({ schedule }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="pb-24 animate-fade-in">
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 shadow-sm flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Programação</h2>
        <span className="text-xs font-medium bg-rose-50 text-rose-600 px-2 py-1 rounded">Dia 20/10</span>
      </div>

      <div className="p-4 space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center pt-1 min-w-[50px]">
              <span className="font-bold text-gray-800">{item.time}</span>
              <div className="h-full w-0.5 bg-gray-200 mt-2 mb-[-16px]"></div>
            </div>
            
            <Card className="flex-1 mb-2 relative overflow-hidden border-l-4 border-l-rose-500">
              <div className="flex justify-between items-start mb-1">
                <CategoryBadge categoryId={item.category} />
                <button onClick={() => toggleFavorite(item.id)} className="p-1">
                  <Heart size={18} className={favorites.includes(item.id) ? "fill-rose-500 text-rose-500" : "text-gray-300"} />
                </button>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.speaker}</p>
              <div className="flex items-center text-xs text-gray-400">
                <MapPin size={12} className="mr-1" /> {item.location}
              </div>
            </Card>
          </div>
        ))}
        {schedule.length === 0 && (
           <p className="text-center text-gray-400 mt-10">Nenhum evento agendado.</p>
        )}
      </div>
    </div>
  );
};

// 4. MAPA (Esquemático CSS Grid)
const MapScreen = ({ exhibitors }) => {
  const booths = Array.from({ length: 24 }, (_, i) => {
    const exhibitor = exhibitors.find(e => e.id === (i % 6) + 1); // Mock mapping logic for demo
    // Realistic mapping would map exhibitor.booth to grid ID
    
    // Simple logic just to show *some* exhibitors on map
    const mappedExhibitor = exhibitors.find(e => {
        // extract number from "A-10" -> 10, simplificação para demo
        return false; 
    }) || (i % 5 === 0 && i < 15 ? exhibitors[i % exhibitors.length] : null);

    const isWalkway = [2, 5, 8, 11, 14, 17].includes(i); 
    
    return { 
      id: i, 
      label: isWalkway ? '' : `Stand ${i + 10}`, 
      type: isWalkway ? 'walkway' : 'booth',
      exhibitor: isWalkway ? null : mappedExhibitor
    };
  });

  return (
    <div className="h-full flex flex-col pb-24 animate-fade-in">
      <div className="px-4 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-xl font-bold text-gray-800">Mapa do Evento</h2>
        <p className="text-xs text-gray-500">Toque em um stand para ver detalhes</p>
      </div>
      
      <div className="flex-1 bg-gray-50 p-4 overflow-auto flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
           <div className="col-span-3 bg-gray-200 h-12 rounded-lg flex items-center justify-center text-gray-500 text-xs font-bold mb-4 border-2 border-dashed border-gray-400">
             ENTRADA PRINCIPAL
           </div>

           {booths.map((cell) => {
             if (cell.type === 'walkway') return <div key={cell.id} className="h-20" />;
             
             return (
               <div 
                 key={cell.id}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center p-1 text-center cursor-pointer transition-all active:scale-95 shadow-sm
                   ${cell.exhibitor ? 'bg-white border-rose-200' : 'bg-gray-100 border-gray-200 opacity-50'}
                 `}
                 onClick={() => cell.exhibitor && alert(`Stand de: ${cell.exhibitor.name}`)}
               >
                 {cell.exhibitor ? (
                   <>
                     <span className="text-[10px] font-bold text-rose-600 line-clamp-2 leading-tight">{cell.exhibitor.name}</span>
                     <span className="text-[8px] text-gray-400 mt-1">{cell.label}</span>
                   </>
                 ) : (
                   <span className="text-[9px] text-gray-400">Livre</span>
                 )}
               </div>
             );
           })}

           <div className="col-span-3 bg-indigo-600 h-24 rounded-lg flex items-center justify-center text-white font-bold mt-4 shadow-lg shadow-indigo-200">
             PALCO PRINCIPAL
           </div>
        </div>
      </div>
    </div>
  );
};

// 5. OFERTAS & CUPONS
const OffersScreen = ({ offers }) => {
  return (
    <div className="pb-24 animate-fade-in bg-gray-50 min-h-screen">
      <div className="bg-rose-600 px-4 pt-8 pb-12 rounded-b-[2.5rem] shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Ofertas Exclusivas</h2>
        <p className="text-rose-100 text-sm">Apresente o código no stand para resgatar.</p>
      </div>

      <div className="-mt-8 px-4 space-y-4">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white rounded-2xl p-0 shadow-md border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-dashed border-gray-200 relative">
               <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2"></div>
               <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2"></div>
               
               <div className="flex justify-between items-start mb-2">
                 <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                   {offer.discount} OFF
                 </span>
                 <div className="flex items-center text-red-500 text-xs font-medium">
                   <Clock size={12} className="mr-1" /> {offer.expires}
                 </div>
               </div>
               
               <h3 className="text-lg font-bold text-gray-800 mb-1">{offer.title}</h3>
               <p className="text-sm text-gray-500">Ofertado por: <span className="font-semibold">{offer.exhibitorName}</span></p>
            </div>
            
            <div className="bg-gray-50 p-4 flex justify-between items-center">
               <div className="text-xs text-gray-400">CÓDIGO DO CUPOM:</div>
               <div className="font-mono text-lg font-bold text-gray-800 tracking-widest border border-gray-300 px-3 py-1 rounded bg-white">
                 {offer.code}
               </div>
            </div>
          </div>
        ))}
         {offers.length === 0 && (
           <div className="text-center pt-20 px-10">
             <Ticket size={48} className="mx-auto text-gray-300 mb-2"/>
             <p className="text-gray-400">Nenhuma oferta ativa no momento.</p>
           </div>
        )}
      </div>
    </div>
  );
};

// 6. PERFIL DO USUÁRIO
const ProfileScreen = ({ user, setUser }) => {
  const toggleInterest = (id) => {
    const current = user.interests || [];
    const updated = current.includes(id) 
      ? current.filter(i => i !== id) 
      : [...current, id];
    setUser({ ...user, interests: updated });
  };

  return (
    <div className="pb-24 animate-fade-in px-4 pt-6">
      <div className="flex items-center mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xl border-4 border-white shadow-lg">
           <User size={32} />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Visitante</span>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <Award size={18} className="mr-2 text-rose-500" /> Seus Interesses
          </h3>
          <p className="text-xs text-gray-500 mb-3">Selecione para receber recomendações personalizadas.</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleInterest(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                  ${user.interests?.includes(cat.id) 
                    ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200' 
                    : 'bg-white border-gray-200 text-gray-600'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <Settings size={18} className="mr-3 text-gray-400" /> Configurações
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <LogOut size={18} className="mr-3 text-gray-400" /> Sair
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </section>
      </div>
    </div>
  );
};

// 7. DASHBOARD ADMIN E FERRAMENTAS
const AdminScreen = ({ data, actions }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState('menu'); 

  // Form States & Editing
  const [exhibitorForm, setExhibitorForm] = useState({ id: null, name: '', category: 'cabelo', booth: '', description: '' });
  const [offerForm, setOfferForm] = useState({ id: null, title: '', exhibitorId: '', discount: '', code: '', expires: '' });
  const [scheduleForm, setScheduleForm] = useState({ id: null, title: '', time: '', speaker: '', location: '', category: 'cabelo' });

  // Reset helpers
  const resetExhibitorForm = () => setExhibitorForm({ id: null, name: '', category: 'cabelo', booth: '', description: '' });
  const resetOfferForm = () => setOfferForm({ id: null, title: '', exhibitorId: '', discount: '', code: '', expires: '' });
  const resetScheduleForm = () => setScheduleForm({ id: null, title: '', time: '', speaker: '', location: '', category: 'cabelo' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '9999') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  /** HANDLERS PARA EXPOSITORES */
  const handleEditExhibitor = (ex) => {
    setExhibitorForm(ex);
    window.scrollTo(0,0);
  };
  
  const handleDeleteExhibitor = (id) => {
    if(confirm('Excluir este expositor?')) actions.deleteExhibitor(id);
  };

  const handleSubmitExhibitor = (e) => {
    e.preventDefault();
    if (exhibitorForm.id) {
      // Update
      actions.updateExhibitor({ 
        ...exhibitorForm, 
        image: exhibitorForm.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=200' 
      });
    } else {
      // Create
      actions.addExhibitor({ 
        ...exhibitorForm, 
        id: Date.now(), 
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=200' 
      });
    }
    resetExhibitorForm();
  };

  /** HANDLERS PARA OFERTAS */
  const handleEditOffer = (offer) => {
    setOfferForm(offer);
    window.scrollTo(0,0);
  };

  const handleDeleteOffer = (id) => {
    if(confirm('Excluir esta oferta?')) actions.deleteOffer(id);
  };

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    const exhibitor = data.exhibitors.find(e => e.id.toString() === offerForm.exhibitorId);
    const offerData = {
      ...offerForm,
      exhibitorName: exhibitor ? exhibitor.name : 'Expositor'
    };

    if (offerForm.id) {
      actions.updateOffer(offerData);
    } else {
      actions.addOffer({ ...offerData, id: Date.now() });
    }
    resetOfferForm();
  };

  /** HANDLERS PARA AGENDA */
  const handleEditSchedule = (item) => {
    setScheduleForm(item);
    window.scrollTo(0,0);
  };

  const handleDeleteSchedule = (id) => {
    if(confirm('Tem certeza que deseja excluir este evento?')) {
        actions.deleteSchedule(id);
    }
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (scheduleForm.id) {
      actions.updateSchedule(scheduleForm);
    } else {
      actions.addSchedule({ ...scheduleForm, id: Date.now() });
    }
    resetScheduleForm();
  };


  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 animate-fade-in">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Área Restrita</h2>
        <p className="text-gray-500 text-center mb-8">Apenas para organizadores do evento.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <Input 
            label="Senha de Acesso" 
            type="password" 
            placeholder="Digite 9999"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
          <Button type="submit">Entrar no Painel</Button>
        </form>
      </div>
    );
  }

  // --- GERENCIAR EXPOSITORES ---
  if (activeTool === 'manageExhibitors') {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => { setActiveTool('menu'); resetExhibitorForm(); }} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{exhibitorForm.id ? 'Editar Expositor' : 'Novo Expositor'}</h2>
          <form onSubmit={handleSubmitExhibitor}>
            <Input label="Nome da Marca" value={exhibitorForm.name} onChange={e => setExhibitorForm({...exhibitorForm, name: e.target.value})} required />
            <Input label="Número do Stand" value={exhibitorForm.booth} onChange={e => setExhibitorForm({...exhibitorForm, booth: e.target.value})} placeholder="Ex: A-22" required />
            <Select label="Categoria" value={exhibitorForm.category} onChange={e => setExhibitorForm({...exhibitorForm, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </Select>
            <Input label="Descrição Curta" value={exhibitorForm.description} onChange={e => setExhibitorForm({...exhibitorForm, description: e.target.value})} required />
            <div className="flex gap-2">
               {exhibitorForm.id && <Button type="button" variant="ghost" onClick={resetExhibitorForm}>Cancelar</Button>}
               <Button type="submit" icon={Save}>{exhibitorForm.id ? 'Atualizar' : 'Salvar'}</Button>
            </div>
          </form>
        </div>

        <h3 className="font-bold text-gray-700 mb-3">Expositores Cadastrados</h3>
        <div className="space-y-3">
          {data.exhibitors.map(ex => (
             <div key={ex.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0"><img src={ex.image} className="w-full h-full object-cover rounded-lg"/></div>
                   <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{ex.name}</p>
                      <p className="text-xs text-gray-500">{ex.booth} • {CATEGORIES.find(c=>c.id===ex.category)?.label}</p>
                   </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                   <button onClick={() => handleEditExhibitor(ex)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                   <button onClick={() => handleDeleteExhibitor(ex.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  // --- GERENCIAR OFERTAS ---
  if (activeTool === 'manageOffers') {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => { setActiveTool('menu'); resetOfferForm(); }} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{offerForm.id ? 'Editar Oferta' : 'Nova Oferta'}</h2>
          <form onSubmit={handleSubmitOffer}>
             <Input label="Título da Oferta" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} placeholder="Ex: 50% OFF" required />
             <Select label="Expositor" value={offerForm.exhibitorId} onChange={e => setOfferForm({...offerForm, exhibitorId: e.target.value})} required>
               <option value="">Selecione...</option>
               {data.exhibitors.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
             </Select>
             <div className="grid grid-cols-2 gap-3">
               <Input label="Desconto" value={offerForm.discount} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} placeholder="Ex: 50%" />
               <Input label="Validade" value={offerForm.expires} onChange={e => setOfferForm({...offerForm, expires: e.target.value})} placeholder="Ex: 1h 30m" />
             </div>
             <Input label="Código do Cupom" value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value})} placeholder="Ex: PROMO50" required />
             <div className="flex gap-2">
                {offerForm.id && <Button type="button" variant="ghost" onClick={resetOfferForm}>Cancelar</Button>}
                <Button type="submit" icon={Ticket}>{offerForm.id ? 'Atualizar' : 'Publicar'}</Button>
             </div>
          </form>
        </div>

        <h3 className="font-bold text-gray-700 mb-3">Ofertas Ativas</h3>
        <div className="space-y-3">
          {data.offers.map(offer => (
             <div key={offer.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="min-w-0">
                   <p className="font-bold text-gray-800 text-sm truncate">{offer.title}</p>
                   <p className="text-xs text-gray-500">{offer.exhibitorName} • {offer.code}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                   <button onClick={() => handleEditOffer(offer)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                   <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
             </div>
          ))}
          {data.offers.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhuma oferta cadastrada.</p>}
        </div>
      </div>
    );
  }

  // --- GERENCIAR AGENDA ---
  if (activeTool === 'manageSchedule') {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => { setActiveTool('menu'); resetScheduleForm(); }} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{scheduleForm.id ? 'Editar Evento' : 'Novo Evento'}</h2>
            <form onSubmit={handleSubmitSchedule}>
                <Input label="Título" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} required />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Horário" type="time" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} required />
                    <Input label="Local" value={scheduleForm.location} onChange={e => setScheduleForm({...scheduleForm, location: e.target.value})} />
                </div>
                <Input label="Palestrante" value={scheduleForm.speaker} onChange={e => setScheduleForm({...scheduleForm, speaker: e.target.value})} />
                <div className="flex gap-2">
                   {scheduleForm.id && <Button type="button" variant="ghost" onClick={resetScheduleForm}>Cancelar</Button>}
                   <Button type="submit" variant="secondary" icon={Save}>{scheduleForm.id ? 'Atualizar' : 'Agendar'}</Button>
                </div>
            </form>
        </div>

        <h3 className="font-bold text-gray-700 mb-2">Agenda Atual</h3>
        <div className="space-y-2">
            {data.schedule.sort((a,b) => a.time.localeCompare(b.time)).map(item => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="min-w-0">
                        <span className="font-bold text-rose-600 text-xs mr-2">{item.time}</span>
                        <span className="text-sm font-medium text-gray-700 truncate">{item.title}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleEditSchedule(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => handleDeleteSchedule(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  // Dashboard Principal
  return (
    <div className="p-6 pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Painel Admin</h2>
          <button onClick={() => setIsAuthenticated(false)} className="text-rose-600 text-xs font-bold border border-rose-200 px-3 py-1 rounded-full">Sair</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="bg-indigo-600 text-white border-none flex flex-col justify-between h-24">
          <p className="text-indigo-200 text-xs font-medium">Expositores</p>
          <h3 className="text-3xl font-bold">{data.exhibitors.length}</h3>
        </Card>
        <Card className="bg-rose-500 text-white border-none flex flex-col justify-between h-24">
          <p className="text-rose-200 text-xs font-medium">Ofertas Ativas</p>
          <h3 className="text-3xl font-bold">{data.offers.length}</h3>
        </Card>
      </div>

      <h3 className="font-bold text-gray-700 mb-4">Gerenciar Evento</h3>
      <div className="space-y-3">
        <Button variant="secondary" icon={User} onClick={() => setActiveTool('manageExhibitors')}>Gerenciar Expositores</Button>
        <Button variant="secondary" icon={Ticket} onClick={() => setActiveTool('manageOffers')}>Gerenciar Ofertas</Button>
        <Button variant="secondary" icon={Calendar} onClick={() => setActiveTool('manageSchedule')}>Gerenciar Agenda</Button>
      </div>
    </div>
  );
};

/**
 * APP PRINCIPAL
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState({
    name: 'Visitante',
    email: 'visitante@email.com',
    role: 'visitor',
    interests: ['cabelo', 'maquiagem']
  });

  // Global State for "Backend" Data
  const [exhibitors, setExhibitors] = useState(INITIAL_EXHIBITORS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [offers, setOffers] = useState(INITIAL_OFFERS);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const adminActions = {
    // Expositores
    addExhibitor: (ex) => setExhibitors([...exhibitors, ex]),
    updateExhibitor: (updated) => setExhibitors(exhibitors.map(ex => ex.id === updated.id ? updated : ex)),
    deleteExhibitor: (id) => setExhibitors(exhibitors.filter(ex => ex.id !== id)),

    // Ofertas
    addOffer: (of) => setOffers([...offers, of]),
    updateOffer: (updated) => setOffers(offers.map(of => of.id === updated.id ? updated : of)),
    deleteOffer: (id) => setOffers(offers.filter(of => of.id !== id)),

    // Agenda
    addSchedule: (sc) => setSchedule([...schedule, sc]),
    updateSchedule: (updated) => setSchedule(schedule.map(sc => sc.id === updated.id ? updated : sc)),
    deleteSchedule: (id) => setSchedule(schedule.filter(s => s.id !== id))
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen onChangeScreen={setCurrentScreen} userInterests={user.interests} exhibitors={exhibitors} />;
      case 'exhibitors': return <ExhibitorsScreen exhibitors={exhibitors} />;
      case 'schedule': return <ScheduleScreen schedule={schedule} />;
      case 'map': return <MapScreen exhibitors={exhibitors} />;
      case 'offers': return <OffersScreen offers={offers} />;
      case 'profile': return <ProfileScreen user={user} setUser={setUser} />;
      case 'admin': return <AdminScreen data={{exhibitors, schedule, offers}} actions={adminActions} />;
      default: return <HomeScreen onChangeScreen={setCurrentScreen} exhibitors={exhibitors} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-100">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2" onClick={() => setCurrentScreen('home')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-fuchsia-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-200">
            MB
          </div>
          <span className="font-bold text-gray-800 text-sm tracking-tight">Maceió Beauty</span>
        </div>
        
        <button 
          onClick={() => setCurrentScreen(currentScreen === 'admin' ? 'home' : 'admin')}
          className={`text-xs font-bold border px-3 py-1 rounded-full transition-colors ${currentScreen === 'admin' ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-400 border-gray-200'}`}
        >
          {currentScreen === 'admin' ? 'Fechar Admin' : 'Admin'}
        </button>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <main className="min-h-screen bg-white">
        {renderScreen()}
      </main>

      {/* NAVEGAÇÃO INFERIOR (TAB BAR) */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center py-2 pb-5 z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        {[
          { id: 'home', icon: Home, label: 'Início' },
          { id: 'schedule', icon: Calendar, label: 'Agenda' },
          { id: 'offers', icon: Ticket, label: 'Ofertas' },
          { id: 'profile', icon: User, label: 'Perfil' },
        ].map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${isActive ? 'text-rose-600 -translate-y-1' : 'text-gray-400'}`}
            >
              {isActive && <div className="w-1 h-1 bg-rose-600 rounded-full mb-1"></div>}
              <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}