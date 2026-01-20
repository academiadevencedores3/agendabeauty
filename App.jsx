import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map, Calendar, User, ShoppingBag, Home, Search, 
  Heart, MapPin, Clock, ChevronRight, Star, 
  Filter, Award, LogOut, Ticket, Settings,
  Plus, Trash2, Save, X, Lock, CheckCircle, Edit2,
  Bus, Phone, MessageCircle, AlertCircle, Check, Image as ImageIcon, Upload,
  Bell, Shield, ChevronLeft
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
  { id: 1, title: 'Kit Reconstrução c/ 40% OFF', exhibitorId: 1, exhibitorName: 'Loreal Pro', discount: '40%', code: 'BEAUTY40', expires: '2h 15m', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Compre 3 Leve 4 Esmaltes', exhibitorId: 5, exhibitorName: 'Risqué', discount: '25%', code: 'UNHAS25', expires: '4h 00m' },
  { id: 3, title: 'Combo Barber Shop', exhibitorId: 4, exhibitorName: 'Barba de Respeito', discount: '30%', code: 'BARBA30', expires: '1h 30m' },
];

const INITIAL_CARAVANS = [
  { id: 1, title: 'Van da Estética - Arapiraca', origin: 'Arapiraca - Posto Divina Luz', date: '20/10', time: '07:00', price: '45,00', seats: 15, available: 4, organizer: 'Maria Cláudia', contact: '82999998888', vehicle: 'Van Sprinter' },
  { id: 2, title: 'Carona Solidária Recife', origin: 'Recife - Derby', date: '21/10', time: '06:00', price: '60,00', seats: 4, available: 1, organizer: 'João Paulo', contact: '81988887777', vehicle: 'Chevrolet Onix' },
  { id: 3, title: 'Ônibus Salões Maceió', origin: 'Maceió - Shopping Pátio', date: '20/10', time: '08:00', price: '20,00', seats: 45, available: 20, organizer: 'Assoc. Cabeleireiros', contact: '82977776666', vehicle: 'Ônibus Executivo' },
];

const MOCK_ORGANIZER_REQUESTS = [
  { id: 101, name: 'Carlos Motorista', phone: '82999991111', vehicle: 'Van Ducato 20 lugares', cpf: '000.111.222-33', status: 'pending' },
  { id: 102, name: 'Ana Viagens', phone: '82988882222', vehicle: 'Ônibus 50 lugares', cpf: '111.222.333-44', status: 'pending' }
];

/**
 * COMPONENTES UTILITÁRIOS
 */

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, type = "button", disabled = false }) => {
  const baseStyle = "w-full py-3 rounded-xl font-medium flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-200",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    outline: "border-2 border-rose-500 text-rose-600 bg-transparent",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    success: "bg-green-500 text-white shadow-lg shadow-green-200"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
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

// Novo Componente de Input de Imagem
const ImageInput = ({ label, value, onChange, recommendedSize }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">{label}</label>
      <div className="space-y-2">
        <input 
          type="text" 
          placeholder="Cole a URL da imagem..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-rose-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label className="flex-1 cursor-pointer bg-white border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <span className="text-xs flex items-center font-medium"><Upload size={14} className="mr-1"/> Fazer Upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          {value && (
            <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
               <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <p className="text-[10px] text-gray-400 ml-1 flex items-center gap-1">
          <AlertCircle size={10} /> Tamanho padrão: <span className="font-medium text-gray-600">{recommendedSize}</span>
        </p>
      </div>
    </div>
  );
};

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
          { icon: Bus, label: 'Caravanas', screen: 'caravans' },
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
    const exhibitor = exhibitors.find(e => e.id === (i % 6) + 1); // Mock mapping
    const isWalkway = [2, 5, 8, 11, 14, 17].includes(i); 
    
    return { 
      id: i, 
      label: isWalkway ? '' : `Stand ${i + 10}`, 
      type: isWalkway ? 'walkway' : 'booth',
      exhibitor: isWalkway ? null : (isWalkway ? null : exhibitor || null)
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
            {offer.image && (
              <div className="h-32 w-full relative">
                 <img src={offer.image} className="w-full h-full object-cover" alt={offer.title} />
              </div>
            )}
            <div className={`p-5 border-b border-dashed border-gray-200 relative ${offer.image ? 'pt-4' : ''}`}>
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
const ProfileScreen = ({ user, setUser, onChangeScreen }) => {
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
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.organizerStatus === 'approved' && (
              <span className="inline-block mt-1 text-teal-600 text-[10px] font-bold uppercase flex items-center">
                <CheckCircle size={10} className="mr-1"/> Organizador Verificado
              </span>
            )}
            {user.organizerStatus === 'pending' && (
              <span className="inline-block mt-1 text-yellow-600 text-[10px] font-bold uppercase flex items-center">
                <Clock size={10} className="mr-1"/> Aguardando Aprovação
              </span>
            )}
          </div>
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
          <button onClick={() => onChangeScreen('settings')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
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

// 7. NOVA TELA: CONFIGURAÇÕES
const SettingsScreen = ({ user, setUser, onBack }) => {
  const [formData, setFormData] = useState({ name: user.name, email: user.email, notifications: true });

  const handleSave = () => {
    setUser({ ...user, name: formData.name, email: formData.email });
    alert('Configurações salvas com sucesso!');
    onBack();
  };

  return (
    <div className="pb-24 animate-fade-in bg-gray-50 min-h-screen">
       {/* Header with Back button */}
       <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 flex items-center gap-3">
         <button onClick={onBack}><ChevronLeft size={24} className="text-gray-600" /></button>
         <h2 className="font-bold text-gray-800 text-lg">Configurações</h2>
       </div>

       <div className="p-4 space-y-6">
          {/* Profile Edit Section */}
          <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 text-sm flex items-center"><User size={16} className="mr-2"/> Dados Pessoais</h3>
            <Input label="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </section>
          
          {/* Notifications Section */}
           <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 text-sm flex items-center"><Bell size={16} className="mr-2"/> Preferências</h3>
            <div className="flex justify-between items-center py-2">
               <span className="text-sm text-gray-600">Receber Notificações Push</span>
               <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle" checked={formData.notifications} onChange={e => setFormData({...formData, notifications: e.target.checked})} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" style={{right: formData.notifications ? 0 : 'auto', left: formData.notifications ? 'auto' : 0}}/>
                  <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.notifications ? 'bg-green-400' : 'bg-gray-300'}`}></label>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100 mt-2">
               <span className="text-sm text-gray-600">Termos de Privacidade</span>
               <ChevronRight size={16} className="text-gray-400"/>
            </div>
          </section>

          <Button onClick={handleSave} icon={Save}>Salvar Alterações</Button>
          
          <button className="w-full text-red-500 text-xs font-bold mt-4 py-3 border border-red-100 rounded-xl hover:bg-red-50" onClick={() => alert('Esta ação é irreversível. (Simulado)')}>
            Excluir Minha Conta
          </button>
       </div>
    </div>
  )
}

// 8. TELA: CARAVANAS
const CaravansScreen = ({ caravans, user, actions }) => {
  const [showForm, setShowForm] = useState(false);
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [newCaravan, setNewCaravan] = useState({ title: '', origin: '', date: '', time: '', price: '', seats: '', contact: '', vehicle: '' });
  const [organizerRequest, setOrganizerRequest] = useState({ name: user.name, phone: '', vehicle: '', cpf: '' });

  const handleCreateCaravan = (e) => {
    e.preventDefault();
    actions.addCaravan({
      ...newCaravan,
      id: Date.now(),
      organizer: user.name,
      available: newCaravan.seats 
    });
    setShowForm(false);
    setNewCaravan({ title: '', origin: '', date: '', time: '', price: '', seats: '', contact: '', vehicle: '' });
  };

  const handleRequestOrganizer = (e) => {
    e.preventDefault();
    actions.requestOrganizer(organizerRequest);
    setShowOrganizerForm(false);
    alert("Sua solicitação foi enviada para análise da administração.");
  };

  const contactOrganizer = (caravan) => {
    alert(`Entrando em contato com ${caravan.organizer} via WhatsApp: ${caravan.contact}\n\n"Olá, tenho interesse na caravana ${caravan.title}"`);
  };

  // Se o usuário quer criar uma caravana
  if (showForm) {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => setShowForm(false)} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Criar Nova Caravana</h2>
        <form onSubmit={handleCreateCaravan} className="space-y-4">
          <Input label="Título da Caravana" placeholder="Ex: Van do Cláudio - Arapiraca" value={newCaravan.title} onChange={e => setNewCaravan({...newCaravan, title: e.target.value})} required />
          <Input label="Origem (Cidade/Bairro)" placeholder="Ex: Arapiraca - Posto Shell" value={newCaravan.origin} onChange={e => setNewCaravan({...newCaravan, origin: e.target.value})} required />
          <div className="grid grid-cols-2 gap-3">
             <Input label="Data" type="text" placeholder="DD/MM" value={newCaravan.date} onChange={e => setNewCaravan({...newCaravan, date: e.target.value})} required />
             <Input label="Horário Saída" type="time" value={newCaravan.time} onChange={e => setNewCaravan({...newCaravan, time: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <Input label="Preço (R$)" placeholder="0,00" value={newCaravan.price} onChange={e => setNewCaravan({...newCaravan, price: e.target.value})} required />
             <Input label="Vagas Totais" type="number" placeholder="15" value={newCaravan.seats} onChange={e => setNewCaravan({...newCaravan, seats: e.target.value})} required />
          </div>
          <Input label="Veículo" placeholder="Ex: Van Ducato 2020" value={newCaravan.vehicle} onChange={e => setNewCaravan({...newCaravan, vehicle: e.target.value})} required />
          <Input label="WhatsApp para Contato" placeholder="(82) 99999-9999" value={newCaravan.contact} onChange={e => setNewCaravan({...newCaravan, contact: e.target.value})} required />
          
          <Button type="submit" icon={Save}>Publicar Caravana</Button>
        </form>
      </div>
    );
  }

  // Se o usuário quer ser organizador
  if (showOrganizerForm) {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => setShowOrganizerForm(false)} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>
        <div className="bg-indigo-50 p-6 rounded-2xl mb-6">
          <Bus size={48} className="text-indigo-600 mb-3" />
          <h2 className="text-xl font-bold text-indigo-900 mb-2">Seja um Organizador</h2>
          <p className="text-indigo-700 text-sm">Cadastre-se para criar caravanas e levar pessoas ao evento. A taxa de segurança será implementada futuramente.</p>
        </div>
        
        <form onSubmit={handleRequestOrganizer} className="space-y-4">
          <Input label="Nome Completo" value={organizerRequest.name} onChange={e => setOrganizerRequest({...organizerRequest, name: e.target.value})} required />
          <Input label="CPF" placeholder="000.000.000-00" value={organizerRequest.cpf} onChange={e => setOrganizerRequest({...organizerRequest, cpf: e.target.value})} required />
          <Input label="Celular / WhatsApp" placeholder="(00) 00000-0000" value={organizerRequest.phone} onChange={e => setOrganizerRequest({...organizerRequest, phone: e.target.value})} required />
          <Input label="Modelo do Veículo Principal" placeholder="Ex: Ônibus Executivo Scania" value={organizerRequest.vehicle} onChange={e => setOrganizerRequest({...organizerRequest, vehicle: e.target.value})} required />
          
          <div className="flex items-start gap-2 mt-4 mb-4">
             <input type="checkbox" required className="mt-1" />
             <span className="text-xs text-gray-500">Declaro que possuo habilitação adequada e meu veículo está em condições regulares de transporte. Concordo com os termos de uso.</span>
          </div>

          <Button type="submit" variant="primary">Enviar Solicitação</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Caravanas</h2>
          
          {user.organizerStatus === 'approved' ? (
            <button onClick={() => setShowForm(true)} className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center shadow-md shadow-rose-200">
               <Plus size={14} className="mr-1"/> Criar
            </button>
          ) : user.organizerStatus === 'pending' ? (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-bold">Análise Pendente</span>
          ) : (
            <button onClick={() => setShowOrganizerForm(true)} className="text-xs border border-rose-600 text-rose-600 px-3 py-1.5 rounded-lg font-bold">
               Ser Organizador
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">Encontre transporte compartilhado para o evento.</p>
      </div>

      <div className="p-4 space-y-4">
        {caravans.map(caravan => (
          <Card key={caravan.id} className="border-l-4 border-l-indigo-500">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-gray-800 text-lg">{caravan.title}</h3>
               <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">R$ {caravan.price}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-2 mb-3">
               <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2 text-indigo-500" /> 
                  <span className="truncate">{caravan.origin}</span>
               </div>
               <div className="flex items-center text-sm text-gray-600">
                  <Clock size={14} className="mr-2 text-indigo-500" /> 
                  {caravan.date} às {caravan.time}
               </div>
               <div className="flex items-center text-sm text-gray-600 col-span-2">
                  <Bus size={14} className="mr-2 text-indigo-500" /> 
                  {caravan.vehicle}
               </div>
             </div>

             <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Organizador</span>
                  <span className="text-xs font-medium text-gray-700">{caravan.organizer}</span>
                  <span className="text-[10px] text-gray-400">{caravan.available} vagas restantes</span>
               </div>
               <button onClick={() => contactOrganizer(caravan)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center transition-colors">
                  <MessageCircle size={14} className="mr-1" /> Reservar Vaga
               </button>
             </div>
          </Card>
        ))}
        
        {caravans.length === 0 && (
          <div className="text-center py-10">
             <Bus size={48} className="mx-auto text-gray-300 mb-2"/>
             <p className="text-gray-400">Nenhuma caravana disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 9. DASHBOARD ADMIN ATUALIZADO
const AdminScreen = ({ data, actions, organizerRequests }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState('menu'); 

  // Form States & Editing
  const [exhibitorForm, setExhibitorForm] = useState({ id: null, name: '', category: 'cabelo', booth: '', description: '', image: '' });
  const [offerForm, setOfferForm] = useState({ id: null, title: '', exhibitorId: '', discount: '', code: '', expires: '', image: '' });
  const [scheduleForm, setScheduleForm] = useState({ id: null, title: '', time: '', speaker: '', location: '', category: 'cabelo' });

  // Reset helpers
  const resetExhibitorForm = () => setExhibitorForm({ id: null, name: '', category: 'cabelo', booth: '', description: '', image: '' });
  const resetOfferForm = () => setOfferForm({ id: null, title: '', exhibitorId: '', discount: '', code: '', expires: '', image: '' });
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
  const handleEditExhibitor = (ex) => { setExhibitorForm(ex); window.scrollTo(0,0); };
  const handleDeleteExhibitor = (id) => { if(confirm('Excluir este expositor?')) actions.deleteExhibitor(id); };
  const handleSubmitExhibitor = (e) => {
    e.preventDefault();
    const finalImage = exhibitorForm.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=200';
    if (exhibitorForm.id) {
      actions.updateExhibitor({ ...exhibitorForm, image: finalImage });
    } else {
      actions.addExhibitor({ ...exhibitorForm, id: Date.now(), image: finalImage });
    }
    resetExhibitorForm();
  };

  /** HANDLERS PARA OFERTAS */
  const handleEditOffer = (offer) => { setOfferForm(offer); window.scrollTo(0,0); };
  const handleDeleteOffer = (id) => { if(confirm('Excluir esta oferta?')) actions.deleteOffer(id); };
  const handleSubmitOffer = (e) => {
    e.preventDefault();
    const exhibitor = data.exhibitors.find(e => e.id.toString() === offerForm.exhibitorId);
    const offerData = { ...offerForm, exhibitorName: exhibitor ? exhibitor.name : 'Expositor' };
    if (offerForm.id) actions.updateOffer(offerData); else actions.addOffer({ ...offerData, id: Date.now() });
    resetOfferForm();
  };

  /** HANDLERS PARA AGENDA */
  const handleEditSchedule = (item) => { setScheduleForm(item); window.scrollTo(0,0); };
  const handleDeleteSchedule = (id) => { if(confirm('Tem certeza que deseja excluir este evento?')) actions.deleteSchedule(id); };
  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (scheduleForm.id) actions.updateSchedule(scheduleForm); else actions.addSchedule({ ...scheduleForm, id: Date.now() });
    resetScheduleForm();
  };

  /** HANDLERS PARA CARAVANAS */
  const handleDeleteCaravan = (id) => { if(confirm('Excluir esta caravana?')) actions.deleteCaravan(id); };
  const handleApproveOrganizer = (id) => { actions.approveOrganizer(id); alert("Organizador Aprovado!"); };
  const handleRejectOrganizer = (id) => { if(confirm('Rejeitar solicitação?')) actions.rejectOrganizer(id); };


  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 animate-fade-in">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Área Restrita</h2>
        <p className="text-gray-500 text-center mb-8">Apenas para organizadores do evento.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <Input label="Senha de Acesso" type="password" placeholder="Digite 9999" value={password} onChange={(e) => setPassword(e.target.value)} />
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
            <ImageInput 
              label="Logo da Marca" 
              value={exhibitorForm.image} 
              onChange={val => setExhibitorForm({...exhibitorForm, image: val})} 
              recommendedSize="500x500px (Quadrado)"
            />
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
                      <p className="text-xs text-gray-500">{ex.booth}</p>
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
             <ImageInput 
              label="Imagem da Oferta (Opcional)" 
              value={offerForm.image} 
              onChange={val => setOfferForm({...offerForm, image: val})} 
              recommendedSize="800x400px (2:1)"
            />
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
                <div className="flex items-center gap-3 overflow-hidden">
                   {offer.image && <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0"><img src={offer.image} className="w-full h-full object-cover rounded-lg"/></div>}
                   <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{offer.title}</p>
                      <p className="text-xs text-gray-500">{offer.exhibitorName} • {offer.code}</p>
                   </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                   <button onClick={() => handleEditOffer(offer)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                   <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
             </div>
          ))}
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

  // --- GERENCIAR CARAVANAS ---
  if (activeTool === 'manageCaravans') {
    return (
      <div className="p-4 pb-24 animate-fade-in">
        <button onClick={() => setActiveTool('menu')} className="mb-4 text-sm text-gray-500 flex items-center"><ChevronRight className="rotate-180 mr-1" size={16}/> Voltar</button>

        {/* Aprovações Pendentes */}
        {organizerRequests.filter(req => req.status === 'pending').length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center"><AlertCircle size={18} className="text-yellow-500 mr-2" /> Aprovações Pendentes</h3>
            <div className="space-y-3">
              {organizerRequests.filter(req => req.status === 'pending').map(req => (
                <div key={req.id} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{req.name}</p>
                      <p className="text-xs text-gray-600">CPF: {req.cpf}</p>
                      <p className="text-xs text-gray-600">Veículo: {req.vehicle}</p>
                      <p className="text-xs text-gray-600">Contato: {req.phone}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleApproveOrganizer(req.id)} className="bg-green-500 text-white p-2 rounded-lg"><Check size={16}/></button>
                      <button onClick={() => handleRejectOrganizer(req.id)} className="bg-red-400 text-white p-2 rounded-lg"><X size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="font-bold text-gray-800 mb-3">Caravanas Ativas</h3>
        <div className="space-y-3">
          {data.caravans.map(caravan => (
            <div key={caravan.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{caravan.title}</p>
                    <p className="text-xs text-gray-500">Org: {caravan.organizer} • {caravan.seats} vagas</p>
                </div>
                <button onClick={() => handleDeleteCaravan(caravan.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
            </div>
          ))}
          {data.caravans.length === 0 && <p className="text-gray-400 text-sm">Nenhuma caravana criada.</p>}
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
          <p className="text-indigo-200 text-xs font-medium">Caravanas</p>
          <h3 className="text-3xl font-bold">{data.caravans.length}</h3>
        </Card>
        <Card className="bg-rose-500 text-white border-none flex flex-col justify-between h-24">
          <p className="text-rose-200 text-xs font-medium">Expositores</p>
          <h3 className="text-3xl font-bold">{data.exhibitors.length}</h3>
        </Card>
      </div>

      <h3 className="font-bold text-gray-700 mb-4">Gerenciar Evento</h3>
      <div className="space-y-3">
        <Button variant="secondary" icon={User} onClick={() => setActiveTool('manageExhibitors')}>Expositores</Button>
        <Button variant="secondary" icon={Bus} onClick={() => setActiveTool('manageCaravans')}>Caravanas & Organizadores</Button>
        <Button variant="secondary" icon={Ticket} onClick={() => setActiveTool('manageOffers')}>Ofertas</Button>
        <Button variant="secondary" icon={Calendar} onClick={() => setActiveTool('manageSchedule')}>Agenda</Button>
      </div>
    </div>
  );
};

/**
 * APP PRINCIPAL
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  // Adicionei organizerStatus: 'none' | 'pending' | 'approved'
  const [user, setUser] = useState({
    id: 999,
    name: 'Visitante',
    email: 'visitante@email.com',
    role: 'visitor',
    organizerStatus: 'none', 
    interests: ['cabelo', 'maquiagem']
  });

  // Global State for "Backend" Data
  const [exhibitors, setExhibitors] = useState(INITIAL_EXHIBITORS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [caravans, setCaravans] = useState(INITIAL_CARAVANS);
  const [organizerRequests, setOrganizerRequests] = useState(MOCK_ORGANIZER_REQUESTS);

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
    deleteSchedule: (id) => setSchedule(schedule.filter(s => s.id !== id)),

    // Caravanas (Usuário Final)
    addCaravan: (cv) => setCaravans([...caravans, cv]),
    
    // Admin Caravanas
    deleteCaravan: (id) => setCaravans(caravans.filter(c => c.id !== id)),
    
    // Solicitação de Organizador
    requestOrganizer: (data) => {
      // Adiciona na lista do Admin
      setOrganizerRequests([...organizerRequests, { ...data, id: Date.now(), userId: user.id, status: 'pending' }]);
      // Atualiza estado local do usuário
      setUser({ ...user, organizerStatus: 'pending' });
    },
    
    // Aprovação Admin
    approveOrganizer: (requestId) => {
      const req = organizerRequests.find(r => r.id === requestId);
      setOrganizerRequests(organizerRequests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
      
      // Se for o usuário atual
      if (req && req.userId === user.id) {
        setUser(prev => ({ ...prev, organizerStatus: 'approved' }));
      }
    },
    
    rejectOrganizer: (requestId) => {
       const req = organizerRequests.find(r => r.id === requestId);
       setOrganizerRequests(organizerRequests.filter(r => r.id !== requestId));
       if (req && req.userId === user.id) {
        setUser(prev => ({ ...prev, organizerStatus: 'none' }));
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen onChangeScreen={setCurrentScreen} userInterests={user.interests} exhibitors={exhibitors} />;
      case 'exhibitors': return <ExhibitorsScreen exhibitors={exhibitors} />;
      case 'schedule': return <ScheduleScreen schedule={schedule} />;
      case 'map': return <MapScreen exhibitors={exhibitors} />;
      case 'offers': return <OffersScreen offers={offers} />;
      case 'caravans': return <CaravansScreen caravans={caravans} user={user} actions={adminActions} />;
      case 'profile': return <ProfileScreen user={user} setUser={setUser} onChangeScreen={setCurrentScreen} />;
      case 'settings': return <SettingsScreen user={user} setUser={setUser} onBack={() => setCurrentScreen('profile')} />;
      case 'admin': return <AdminScreen data={{exhibitors, schedule, offers, caravans}} organizerRequests={organizerRequests} actions={adminActions} />;
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
          { id: 'caravans', icon: Bus, label: 'Caravana' },
          { id: 'offers', icon: Ticket, label: 'Ofertas' },
          { id: 'profile', icon: User, label: 'Perfil' },
        ].map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center w-14 transition-all duration-300 ${isActive ? 'text-rose-600 -translate-y-1' : 'text-gray-400'}`}
            >
              {isActive && <div className="w-1 h-1 bg-rose-600 rounded-full mb-1"></div>}
              <item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className="text-[9px] font-medium mt-1">{item.label}</span>
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