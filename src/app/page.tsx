'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaYoutube,
  FaArrowRight,
  FaBuilding,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaBullseye,
  FaRocket,
  FaQuestionCircle,
  FaUsers,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import RegistrationModal from '../components/RegistrationModal';

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-09-09T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
      {[
        { value: timeLeft.days, label: 'Jours' },
        { value: timeLeft.hours, label: 'Heures' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Secondes' }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20"
        >
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            {item.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-white/80">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
                          <h1 className="text-2xl font-bold text-[#333230]">
              AMITH
            </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('objectives')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                Objectifs
              </button>
              <button 
                onClick={() => scrollToSection('events')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                Événements
              </button>
              <button 
                onClick={() => scrollToSection('speakers')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                Intervenants
              </button>
              <button 
                onClick={() => scrollToSection('programme')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                Programme
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 hover:text-[#51b960]' : 'text-white hover:text-[#51b960]'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Action Button */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => setIsRegistrationModalOpen(true)}
                className="bg-[#51b960] hover:bg-[#45a050] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Inscrivez-vous
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-4">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  À propos
                </button>
                <button 
                  onClick={() => scrollToSection('objectives')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  Objectifs
                </button>
                <button 
                  onClick={() => scrollToSection('events')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  Événements
                </button>
                <button 
                  onClick={() => scrollToSection('speakers')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  Intervenants
                </button>
                <button 
                  onClick={() => scrollToSection('programme')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  Programme
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left text-gray-700 hover:text-[#51b960] font-medium py-2"
                >
                  Contact
                </button>
                <button 
                  onClick={() => setIsRegistrationModalOpen(true)}
                  className="w-full bg-[#51b960] hover:bg-[#45a050] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Inscrivez-vous
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: 'url(/videoframe_3161.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#51b960]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Les Rencontres Régionales
              <span className="block text-yellow-400">EXPORT</span>
            </h1>
            <p className="text-xl md:text-2xl text-sky-200 mb-8">
              Des Industriels du Textile-Habillement Marocain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center items-center gap-4 text-white/90 mb-6">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>Casablanca • Rabat • Marrakech</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span className="font-semibold">09 Septembre 2025</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <CountdownTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
              Découvrir programme
              <FaArrowRight />
            </button>
            <button 
              onClick={() => setIsRegistrationModalOpen(true)}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#333230] font-semibold px-8 py-4 rounded-lg transition-colors duration-300"
            >
              Inscrivez-vous
            </button>
          </motion.div>
        </div>
      </section>

      {/* Organisateurs Section */}
      <section className="py-1 bg-[#51b960]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="w-full h-36 bg-sky-200 flex items-center justify-center hover:bg-yellow-200 transition-colors duration-300 cursor-pointer group">
                <img 
                  src="/logo1.png" 
                  alt="Organisateur 1" 
                  className="h-24 w-auto object-contain filter brightness-0 saturate-100 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-300" 
                />
              </div>
              <div className="w-full h-full bg-sky-200 flex items-center justify-center hover:bg-yellow-200 transition-colors duration-300 cursor-pointer group">
                <img 
                  src="/logo2.png" 
                  alt="Organisateur 2" 
                  className="h-24 w-auto object-contain filter brightness-0 saturate-100 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-300" 
                />
              </div>
              <div className="w-full h-full bg-sky-200 flex items-center justify-center hover:bg-yellow-200 transition-colors duration-300 cursor-pointer group">
                <img 
                  src="/logo3.png" 
                  alt="Organisateur 3" 
                  className="h-24 w-auto object-contain filter brightness-0 saturate-100 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-300" 
                />
              </div>
          </div>
        </motion.div>
      </section>

      {/* À propos Section */}
      <section id="about" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* International Trade Background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* World Map Silhouette */}
            <path d="M100,200 Q200,150 300,200 Q400,180 500,200 Q600,220 700,200 Q800,190 900,200 Q1000,210 1100,200 L1100,300 Q1000,320 900,300 Q800,310 700,300 Q600,280 500,300 Q400,320 300,300 Q200,310 100,300 Z" fill="#1e40af"/>
            <circle cx="200" cy="150" r="30" fill="#1e40af"/>
            <circle cx="600" cy="180" r="25" fill="#1e40af"/>
            <circle cx="800" cy="250" r="20" fill="#1e40af"/>
            <circle cx="1000" cy="220" r="18" fill="#1e40af"/>
          </svg>
        </div>
        
        {/* Trade Route Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="tradeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M100,200 Q300,150 500,200 T900,200" stroke="url(#tradeGradient)" strokeWidth="3" fill="none"/>
            <path d="M200,300 Q400,250 600,300 T1000,300" stroke="url(#tradeGradient)" strokeWidth="2" fill="none"/>
            <path d="M150,500 Q350,450 550,500 T950,500" stroke="url(#tradeGradient)" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Floating Trade Icons */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-6 h-4 bg-[#51b960]/20 rounded-sm transform rotate-12 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-5 h-3 bg-[#51b960]/15 rounded-sm transform -rotate-6 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-7 h-4 bg-[#51b960]/25 rounded-sm transform rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/4 w-4 h-2 bg-[#51b960]/20 rounded-sm transform -rotate-12 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">À propos</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Main text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Bienvenue à notre série de rencontres dédiées aux industriels du secteur Textile Habillement.
                </p>
                <p>
                  Ces événements visent à combiner présentation, inspiration, réflexion stratégique et témoignages concrets, tout en s&apos;ancrant fermement dans le plan d&apos;action à l&apos;export.
                </p>
              </div>
            </motion.div>

            {/* Right side - Grid arrangement of objective cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Top row - 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <FaRocket className="text-2xl" />,
                    title: "Valoriser",
                    description: "Valoriser les réussites à l'export des entreprises marocaines"
                  },
                  {
                    icon: <FaBullseye className="text-2xl" />,
                    title: "Diffuser",
                    description: "Diffuser les axes stratégiques de la feuille de route AMITH"
                  }
                ].map((objective, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-105"
                  >
                    <div className="text-[#51b960] mb-4 group-hover:text-[#45a050] transition-colors">
                      {objective.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {objective.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {objective.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom row - 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <FaHandshake className="text-2xl" />,
                    title: "Encourager",
                    description: "Encourager les synergies régionales"
                  },
                  {
                    icon: <FaGlobe className="text-2xl" />,
                    title: "Promouvoir",
                    description: "Promouvoir les outils disponibles pour accompagner l'internationalisation"
                  },
                  {
                    icon: <FaLightbulb className="text-2xl" />,
                    title: "Répondre",
                    description: "Répondre aux nouvelles exigences : sociales, environnementales, passport digital"
                  }
                ].map((objective, index) => (
                  <motion.div
                    key={index + 2}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:scale-105"
                  >
                    <div className="text-[#51b960] mb-4 group-hover:text-[#45a050] transition-colors">
                      {objective.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {objective.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {objective.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objectifs Section */}
      <section id="objectives" className="py-20 bg-white relative overflow-hidden">
        {/* Shipping Containers Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-16 h-12 bg-[#51b960]/20 transform rotate-12"></div>
          <div className="absolute top-20 left-32 w-16 h-12 bg-[#51b960]/15 transform -rotate-6"></div>
          <div className="absolute top-32 left-20 w-16 h-12 bg-[#51b960]/25 transform rotate-45"></div>
          <div className="absolute top-40 left-48 w-16 h-12 bg-[#51b960]/20 transform -rotate-12"></div>
          
          <div className="absolute top-60 right-20 w-16 h-12 bg-[#51b960]/20 transform rotate-12"></div>
          <div className="absolute top-80 right-40 w-16 h-12 bg-[#51b960]/15 transform -rotate-6"></div>
          <div className="absolute top-100 right-10 w-16 h-12 bg-[#51b960]/25 transform rotate-45"></div>
          <div className="absolute top-120 right-60 w-16 h-12 bg-[#51b960]/20 transform -rotate-12"></div>
          
          <div className="absolute bottom-20 left-1/4 w-16 h-12 bg-[#51b960]/20 transform rotate-12"></div>
          <div className="absolute bottom-40 left-1/3 w-16 h-12 bg-[#51b960]/15 transform -rotate-6"></div>
          <div className="absolute bottom-60 left-1/2 w-16 h-12 bg-[#51b960]/25 transform rotate-45"></div>
        </div>
        
        {/* Cargo Ship Silhouettes */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-1/4 left-1/4 w-8 h-4 bg-[#51b960]/30 rounded-sm transform rotate-12 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-3 bg-[#51b960]/25 rounded-sm transform -rotate-6 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-7 h-3 bg-[#51b960]/35 rounded-sm transform rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-2 bg-[#51b960]/20 rounded-sm transform -rotate-12 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaBullseye className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Objectifs</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Valorisation des Réussites",
                description: "Mettre en lumière les succès à l'export des entreprises marocaines pour inspirer et motiver l'ensemble du secteur."
              },
              {
                title: "Diffusion Stratégique",
                description: "Partager les axes stratégiques de la feuille de route AMITH pour aligner les efforts de tous les acteurs."
              },
              {
                title: "Synergies Régionales",
                description: "Favoriser les collaborations entre les différentes régions pour renforcer l'écosystème textile national pour l'export"
              },
              {
                title: "Accompagnement",
                description: "Présenter les outils et offres disponibles pour soutenir l'internationalisation des entreprises du secteur"
              }
            ].map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-xl border border-sky-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {objective.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Événements Section */}
      <section id="events" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* World Map Background */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Continents */}
            <path d="M100,200 Q200,150 300,200 Q400,180 500,200 Q600,220 700,200 Q800,190 900,200 Q1000,210 1100,200 L1100,300 Q1000,320 900,300 Q800,310 700,300 Q600,280 500,300 Q400,320 300,300 Q200,310 100,300 Z" fill="#3b82f6" opacity="0.1"/>
            <path d="M50,400 Q150,350 250,400 Q350,380 450,400 Q550,420 650,400 Q750,390 850,400 Q950,410 1050,400 L1050,500 Q950,520 850,500 Q750,510 650,500 Q550,480 450,500 Q350,520 250,500 Q150,530 50,500 Z" fill="#1d4ed8" opacity="0.1"/>
            <path d="M200,600 Q300,550 400,600 Q500,580 600,600 Q700,620 800,600 Q900,590 1000,600 L1000,700 Q900,720 800,700 Q700,710 600,700 Q500,680 400,700 Q300,720 200,700 Z" fill="#1e40af" opacity="0.1"/>
            
            {/* Major Cities */}
            <circle cx="200" cy="150" r="8" fill="#3b82f6" opacity="0.3"/>
            <circle cx="600" cy="180" r="6" fill="#1d4ed8" opacity="0.3"/>
            <circle cx="800" cy="250" r="5" fill="#1e40af" opacity="0.3"/>
            <circle cx="1000" cy="220" r="4" fill="#3b82f6" opacity="0.3"/>
            <circle cx="400" cy="450" r="7" fill="#1d4ed8" opacity="0.3"/>
            <circle cx="700" cy="650" r="6" fill="#1e40af" opacity="0.3"/>
          </svg>
        </div>
        
        {/* Connection Lines */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <line x1="200" y1="150" x2="600" y2="180" stroke="url(#connectionGradient)" strokeWidth="2"/>
            <line x1="600" y1="180" x2="800" y2="250" stroke="url(#connectionGradient)" strokeWidth="2"/>
            <line x1="800" y1="250" x2="1000" y2="220" stroke="url(#connectionGradient)" strokeWidth="2"/>
            <line x1="400" y1="450" x2="700" y2="650" stroke="url(#connectionGradient)" strokeWidth="2"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Nos Événements</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          {/* Three City Cards */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  city: "Casablanca",
                  date: "15 Septembre 2025",
                  venue: "Centre de Conférences Anfa",
                  address: "Boulevard de la Corniche"
                },
                {
                  city: "Tanger",
                  date: "22 Septembre 2025",
                  venue: "Palais des Congrès de Tanger",
                  address: "Avenue Mohammed V"
                },
                {
                  city: "Fes",
                  date: "29 Septembre 2025",
                  venue: "Centre de Conférences Fès",
                  address: "Route d'Ifrane"
                }
              ].map((event, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 hover:border-[#51b960]"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.city}</h3>
                    <div className="flex items-center justify-center gap-2 text-[#51b960] mb-4">
                      <FaCalendarAlt />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-[#51b960] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">{event.venue}</p>
                        <p className="text-gray-600 text-sm">{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-[#51b960] hover:bg-[#45a050] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                Découvrir programme
                <FaArrowRight />
              </button>
              <button 
                onClick={() => setIsRegistrationModalOpen(true)}
                className="bg-transparent border-2 border-[#51b960] text-[#51b960] hover:bg-[#51b960] hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Inscrivez-vous !
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos Intervenants Section */}
      <section id="speakers" className="py-24 bg-gradient-to-br from-[#333230] via-[#2a2928] to-[#1f1e1d] relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#51b960]/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        


        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Nos Intervenants</h2>
            </div>
            <div className="w-24 h-1 bg-white rounded-full"></div>
          </motion.div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                id: 1,
                name: "Dr. Fatimzahra Mziouad",
                title: "Gérante",
                company: "AIM Performance",
                bio: "Expert international avec plus de 15 ans d'expérience dans l'exportation textile vers les marchés européens et africains. Spécialiste des stratégies de pénétration de marché.",
                linkedin: "#"
              },
              {
                id: 2,
                name: "Fatima Zahra Alami",
                title: "Consultante Internationale",
                company: "Global Trade Consulting",
                bio: "Consultante senior en commerce international, experte en réglementations douanières et en développement de partenariats stratégiques à l'international.",
                linkedin: "#"
              },
              {
                id: 3,
                name: "Youssef El Mansouri",
                title: "CEO & Fondateur",
                company: "Export Solutions Group",
                bio: "Entrepreneur visionnaire avec 20 ans d'expérience dans l'exportation. Expert en transformation digitale des processus d'export et en innovation textile.",
                linkedin: "#"
              },
              {
                id: 4,
                name: "Aicha Benslimane",
                title: "Directrice Marketing Export",
                company: "Fashion Forward Morocco",
                bio: "Spécialiste du marketing international et de la communication interculturelle. Experte en développement de marques à l'international et en e-commerce B2B.",
                linkedin: "#"
              }
            ].map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Speaker Card */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                  {/* Speaker Image */}
                  <div className="relative mb-8">
                    <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-white/30 group-hover:border-white/60 transition-all duration-500">
                      <img 
                        src={`/speaker${speaker.id}.png`} 
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Speaker Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-200 transition-colors duration-300">
                      {speaker.name}
                    </h3>
                    <p className="text-sky-200 text-sm mb-1 font-medium">
                      {speaker.title}
                    </p>
                    <p className="text-sky-300 text-xs mb-6">
                      {speaker.company}
                    </p>
                    
                    {/* Bio Preview */}
                    <p className="text-sky-100 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      {speaker.bio}
                    </p>
                  </div>

                  {/* LinkedIn Button */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <a 
                      href={speaker.linkedin} 
                      className="w-12 h-12 bg-[#51b960] hover:bg-[#45a050] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <FaLinkedin className="text-white text-xl" />
                    </a>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#333230]/80 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* Programme Section */}
      <section id="programme" className="py-20 bg-white relative overflow-hidden">
        {/* Cargo Ships Background */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute top-20 left-20 w-12 h-6 bg-[#51b960]/25 rounded-sm transform rotate-12 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-10 h-5 bg-[#51b960]/20 rounded-sm transform -rotate-6 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-14 h-7 bg-[#51b960]/30 rounded-sm transform rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/4 w-8 h-4 bg-[#51b960]/25 rounded-sm transform -rotate-12 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-60 left-1/2 w-11 h-5 bg-[#51b960]/20 rounded-sm transform rotate-30 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Shipping Routes */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M50,200 Q200,150 350,200 T650,200 T950,200" stroke="url(#routeGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
            <path d="M100,400 Q300,350 500,400 T900,400" stroke="url(#routeGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
            <path d="M150,600 Q350,550 550,600 T950,600" stroke="url(#routeGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaClock className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Programme</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                time: "14h00 - 14h30",
                title: "Accueil et Networking",
                description: "Accueil chaleureux des participants, distribution du programme détaillé et temps d'échange informel entre les industriels pour favoriser les connexions professionnelles avant le début des présentations officielles."
              },
              {
                time: "14h30 - 15h00",
                title: "Présentations Institutionnelles",
                description: "Introduction du programme TPI et présentation du dispositif d'accompagnement du MCINET, suivies par la valorisation des partenaires institutionnels et financiers soutenant l'initiative."
              },
              {
                time: "15h00 - 16h00",
                title: "Bilan et Plan d'Action",
                description: "Exposé des réalisations de l'AMITH à l'export et présentation détaillée du plan d'action stratégique avec les objectifs ambitieux fixés pour 2025."
              },
              {
                time: "16h00 - 17h15",
                title: "Témoignages et Questions",
                description: "Session interactive avec témoignages d'entreprises locales ayant réussi à l'export, suivie d'une période de questions-réponses pour éclaircir les points d'intérêt des participants."
              },
              {
                time: "17h15 - 17h30",
                title: "Clôture et Prochaines Étapes",
                description: "Conclusion de l'événement avec un message fédérateur, remerciements aux participants et partage d'informations pratiques sur les ressources disponibles après la rencontre."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-[#51b960] rounded-full mt-2"></div>
                  {index < 4 && (
                    <div className="w-px h-24 bg-gray-300 ml-2 mt-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-[#51b960] font-semibold">
                        <FaClock />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Trade Routes Background */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="tradeRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/>
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            <path d="M100,200 Q300,150 500,200 T900,200" stroke="url(#tradeRouteGradient)" strokeWidth="3" fill="none"/>
            <path d="M200,300 Q400,250 600,300 T1000,300" stroke="url(#tradeRouteGradient)" strokeWidth="2" fill="none"/>
            <path d="M150,500 Q350,450 550,500 T950,500" stroke="url(#tradeRouteGradient)" strokeWidth="2" fill="none"/>
            <path d="M50,600 Q250,550 450,600 T850,600" stroke="url(#tradeRouteGradient)" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Port Icons */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute top-20 left-20 w-4 h-4 bg-[#51b960]/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-[#51b960]/25 rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-[#51b960]/35 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-[#51b960]/30 rounded-full"></div>
          <div className="absolute top-60 left-1/2 w-4 h-4 bg-[#51b960]/25 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaQuestionCircle className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">FAQ</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "Qui peut participer à ces rencontres régionales ?",
                answer: "Ces rencontres sont ouvertes aux industriels du secteur textile-habillement, dirigeants d'entreprises, consultants spécialisés, et représentants d'institutions partenaires. L'événement s'adresse particulièrement aux entreprises intéressées par l'export et l'internationalisation."
              },
              {
                question: "Comment s'inscrire aux événements ?",
                answer: "L'inscription se fait en ligne via notre formulaire dédié. Il suffit de remplir les informations de votre entreprise et de sélectionner l'événement de votre choix. Vous recevrez une confirmation par email avec tous les détails pratiques."
              },
              {
                question: "Quels outils d'accompagnement seront présentés ?",
                answer: "Nous présenterons une gamme complète d'outils d'accompagnement incluant les programmes TPI, les dispositifs du MCINET, les offres de financement à l'export, et les services de conseil en internationalisation disponibles pour les entreprises du secteur."
              },
              {
                question: "Les événements seront-ils disponibles en ligne ?",
                answer: "Oui, nous proposons un format hybride avec retransmission en direct et enregistrements disponibles après l'événement. Les participants en ligne pourront poser des questions via notre plateforme interactive."
              },
              {
                question: "Comment se déroule le networking pendant l'événement ?",
                answer: "Le networking est facilité par des sessions dédiées, une application mobile pour échanger les contacts, et des espaces de rencontre informels. Nous organisons également des tables rondes thématiques pour favoriser les échanges ciblés."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <FaQuestionCircle className={`text-[#51b960] transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white relative overflow-hidden">
        {/* Global Connections Background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="globalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            {/* Global Network Lines */}
            <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#globalGradient)" strokeWidth="2" fill="none"/>
            <path d="M50,400 Q250,300 450,400 T850,400" stroke="url(#globalGradient)" strokeWidth="2" fill="none"/>
            <path d="M150,600 Q350,500 550,600 T950,600" stroke="url(#globalGradient)" strokeWidth="2" fill="none"/>
            <path d="M200,800 Q400,700 600,800 T1000,800" stroke="url(#globalGradient)" strokeWidth="2" fill="none"/>
            
            {/* Cross connections */}
            <line x1="200" y1="200" x2="400" y2="400" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5"/>
            <line x1="600" y1="200" x2="800" y2="400" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5"/>
            <line x1="400" y1="400" x2="600" y2="600" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5"/>
            <line x1="800" y1="400" x2="1000" y2="600" stroke="url(#globalGradient)" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
        
        {/* Connection Nodes */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-20 left-20 w-3 h-3 bg-[#51b960]/40 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-[#51b960]/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-4 h-4 bg-[#51b960]/45 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-[#51b960]/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-60 left-1/2 w-3 h-3 bg-[#51b960]/35 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#51b960] rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Contactez Nous</h2>
            </div>
            <div className="w-24 h-1 bg-[#51b960] rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations de Contact</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <FaBuilding className="text-[#51b960] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">AMITH</p>
                      <p className="text-gray-600">Association Marocaine des Industries du Textile et de l&apos;Habillement</p>
                      <p className="text-gray-600">Casablanca, Maroc</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <FaPhone className="text-[#51b960]" />
                    <span className="text-gray-600">+212 5 22 27 73 00</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <FaEnvelope className="text-[#51b960]" />
                    <span className="text-gray-600">contact@amith.ma</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <FaClock className="text-[#51b960]" />
                    <span className="text-gray-600">Lundi - Vendredi: 9h00 - 18h00</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Suivez-nous</h4>
                  <div className="flex gap-4">
                    {[
                      { icon: FaLinkedin, color: 'text-[#51b960]' },
                      { icon: FaTwitter, color: 'text-sky-400' },
                      { icon: FaFacebook, color: 'text-sky-600' },
                      { icon: FaYoutube, color: 'text-red-600' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`${social.color} hover:scale-110 transition-transform duration-200`}
                      >
                        <social.icon size={24} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51b960]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#51b960] hover:bg-[#45a050] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Envoyer le message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333230] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">AMITH</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                L&apos;Association Marocaine des Industries du Textile et de l&apos;Habillement est le partenaire de référence pour le développement et l&apos;internationalisation du secteur textile-habillement au Maroc.
              </p>
              <div className="space-y-2 text-gray-300">
                <p>Casablanca, Maroc</p>
                <p>+212 5 22 27 73 00</p>
                <p>contact@amith.ma</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                {['À propos', 'Nos Événements', 'Programme', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Informations Légales</h4>
              <ul className="space-y-2">
                {['Politique de confidentialité', 'Conditions d\'utilisation', 'Mentions légales'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2025 AMITH. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
      />
    </div>
  );
}
