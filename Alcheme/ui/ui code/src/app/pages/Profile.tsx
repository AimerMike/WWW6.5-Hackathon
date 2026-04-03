import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import backgroundImage from '../../assets/72231f1464b340d2245b2bbde298ee0c442dcab7.png';
import radarChart from '../../assets/8628d1767a938c32bd29237101e888654b783537.png';
import collectButton from '../../assets/f103e578864ca4d98d1d93e72ca377df8077381a.png';
import refineButton from '../../assets/bcc24e622f7079ba9837ab4380e8eb2c99b889d1.png';
import awakenButton from '../../assets/5042fea45ce6ca07d2d6371987ccbdb342fe1d29.png';
import profileButton from '../../assets/dd0fae2b566b4d9b18684364e779990d3e3e7890.png';
import owlImage from '../../assets/5dfb73f2e2092eb765b24ba8c1a852ce5f3731e9.png';
import alchemeLogo from '../../assets/a82dc1e92d5a60168dfc16bfe3402cf3da775301.png';
import characterImage from '../../assets/bfee606d5dfec7a73890cb51b71e5c43e6c26854.png';

interface Medal {
  id: string;
  text: string;
  date: string;
  cards?: Array<{
    id: string;
    cardBgIndex: number;
    stampIndex: number;
    text: string;
    date: string;
    ores?: Array<{
      date: string;
      content: string;
    }>;
  }>;
}

export default function Profile() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [editingNickname, setEditingNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null);

  useEffect(() => {
    // Load nickname from localStorage
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      setNickname(savedNickname);
      setEditingNickname(savedNickname);
    } else {
      setNickname('Chibi Mage');
      setEditingNickname('Chibi Mage');
    }

    // ==============================
    // 🔌 只改这里：从接口拉取勋章/成就
    // ==============================
    const loadMedals = async () => {
      try {
        const res = await fetch("/api/medals");
        const data = await res.json();
        setMedals(data.data || []);
      } catch (e) {
        // 接口异常本地兜底
        const medalsData = localStorage.getItem('awakenedMedals');
        if (medalsData) {
          setMedals(JSON.parse(medalsData));
        }
      }
    };

    loadMedals();

    // Listen for updates
    const handleMedalsUpdate = () => {
      loadMedals();
    };

    window.addEventListener('cardsUpdated', handleMedalsUpdate);
    window.addEventListener('oresUpdated', handleMedalsUpdate);
    return () => {
      window.removeEventListener('cardsUpdated', handleMedalsUpdate);
      window.removeEventListener('oresUpdated', handleMedalsUpdate);
    };
  }, []);

  const handleSaveNickname = () => {
    if (editingNickname.trim()) {
      setNickname(editingNickname.trim());
      localStorage.setItem('userNickname', editingNickname.trim());
      setIsEditing(false);
    }
  };

  const handleShare = () => {
    alert(`Share ${nickname}'s Soul Archive!\n\nYou have collected ${medals.length} medal${medals.length !== 1 ? 's' : ''}!`);
  };

  const handleMedalClick = (medal: Medal) => {
    setSelectedMedal(medal);
  };

  const closeMedalModal = () => {
    setSelectedMedal(null);
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        width: '1920px',
        height: '1080px',
        maxWidth: '1920px',
        maxHeight: '1080px',
        margin: '0 auto',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Cormorant Garamond', serif"
      }}
    >
      {/* Main container with border */}
      <div className="relative w-full max-w-7xl bg-gradient-to-br from-purple-100/40 via-pink-50/30 to-cyan-100/40 rounded-3xl shadow-2xl border-4 border-amber-200/60 backdrop-blur-sm p-8">
        
        {/* Top section - Title and Navigation */}
        <div className="flex items-start justify-between mb-6">
          {/* Title - Using logo image */}
          <div>
            <img 
              src={alchemeLogo} 
              alt="Alcheme" 
              className="h-32 w-auto"
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/')}
              className="hover:scale-110 transition-transform"
            >
              <img src={collectButton} alt="Collect" className="w-24 h-24 object-contain" />
            </button>
            <button 
              onClick={() => navigate('/refine')}
              className="hover:scale-110 transition-transform"
            >
              <img src={refineButton} alt="Refine" className="w-24 h-24 object-contain" />
            </button>
            <button 
              onClick={() => navigate('/awaken')}
              className="hover:scale-110 transition-transform"
            >
              <img src={awakenButton} alt="Awaken" className="w-24 h-24 object-contain" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="hover:scale-110 transition-transform"
            >
              <img src={profileButton} alt="Profile" className="w-24 h-24 object-contain opacity-70" />
            </button>
          </div>
        </div>

        {/* Main content area - Grid layout matching Home */}
        <div className="grid grid-cols-12 gap-8 mt-8">
          
          {/* Left - Character (same as Home) */}
          <div className="col-span-4 flex items-center justify-center">
            <div className="relative">
              <img 
                src={characterImage} 
                alt="Alchemist Character" 
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  maxHeight: '500px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))'
                }}
              />
            </div>
          </div>

          {/* Center - Medal Wall (3x3 grid, slightly smaller) */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div 
              className="relative bg-gradient-to-br from-amber-100/80 via-yellow-50/70 to-amber-200/80 rounded-2xl p-5"
              style={{
                width: '100%',
                maxWidth: '380px',
                border: '4px solid #8b6914',
                boxShadow: '0 8px 24px rgba(139, 105, 20, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
              }}
            >
              {/* Title */}
              <div 
                className="text-center mb-3"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#3d2817',
                  textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                  letterSpacing: '2px'
                }}
              >
                MEDAL WALL
              </div>

              {/* 3x3 Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slotIndex) => {
                  const medal = medals[slotIndex];
                  return (
                    <div 
                      key={slotIndex}
                      className="relative"
                      style={{
                        aspectRatio: '1/1',
                        background: medal 
                          ? 'linear-gradient(135deg, #f4d03f 0%, #daa520 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(245, 230, 211, 0.4) 100%)',
                        border: medal 
                          ? '3px solid #8b6914'
                          : '3px dashed rgba(139, 105, 20, 0.3)',
                        borderRadius: '12px',
                        boxShadow: medal 
                          ? '0 4px 12px rgba(255, 215, 0, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.4)'
                          : 'inset 0 2px 4px rgba(139, 105, 20, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {medal ? (
                        <button
                          onClick={() => handleMedalClick(medal)}
                          className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative group"
                        >
                          {/* Medal Icon */}
                          <Award 
                            size={50} 
                            style={{
                              color: '#8b6914',
                              filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.6))',
                              strokeWidth: 2.5
                            }}
                          />
                          
                          {/* Sparkle effect on hover */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                              pointerEvents: 'none'
                            }}
                          />
                        </button>
                      ) : (
                        // Empty slot
                        <div className="w-full h-full flex items-center justify-center">
                          <div 
                            style={{
                              fontSize: '2.5rem',
                              color: 'rgba(139, 105, 20, 0.2)',
                              fontWeight: 700
                            }}
                          >
                            ?
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - Owl, Radar Chart and Nickname/Share (same layout as Home) */}
          <div className="col-span-4 flex flex-col items-center justify-start relative pt-4">
            {/* Steampunk Owl - positioned at top (same as Home) */}
            <div className="relative z-10 mb-4">
              <img 
                src={owlImage} 
                alt="Steampunk Owl" 
                className="w-40 h-40 object-contain drop-shadow-2xl"
                style={{
                  animation: 'owlFloat 3.5s ease-in-out infinite'
                }}
              />
            </div>

            {/* Radar Chart */}
            <div className="relative w-full max-w-xs mb-6">
              <img 
                src={radarChart} 
                alt="Six-Dimensional Radar Chart" 
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>

            {/* Nickname Section */}
            <div className="w-full max-w-xs mb-4">
              <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg"
                style={{
                  background: 'rgba(255, 250, 235, 0.8)',
                  border: '2px solid #8b6914',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <span 
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#8b6914',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  USER'S NICKNAME
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editingNickname}
                      onChange={(e) => setEditingNickname(e.target.value)}
                      className="px-3 py-1 rounded-lg border-2 border-amber-600 flex-1"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.1rem',
                        color: '#3d2817',
                        background: 'rgba(255, 250, 235, 0.95)',
                        fontWeight: 600
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveNickname}
                      className="px-3 py-1 rounded-lg hover:scale-105 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #f4d03f 0%, #daa520 100%)',
                        border: '2px solid #8b6914',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#3d2817',
                        textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:scale-105 transition-all"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1.3rem',
                      fontWeight: 600,
                      color: '#3d2817',
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    {nickname}
                  </button>
                )}
              </div>
            </div>

            {/* Share button */}
            <div className="w-full max-w-xs">
              <button
                onClick={handleShare}
                className="w-full hover:scale-105 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 100%)',
                  border: '3px solid #8b6914',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  boxShadow: '0 4px 12px rgba(139, 105, 20, 0.4)'
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#3d2817',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.5px'
                  }}
                >
                  Share my Soul Archive
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medal Detail Modal */}
      {selectedMedal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeMedalModal}
        >
          <div 
            className="relative bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 rounded-3xl p-8 max-w-3xl max-h-[80vh] overflow-y-auto"
            style={{
              border: '4px solid #8b6914',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeMedalModal}
              className="absolute top-4 right-4 hover:scale-110 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 230, 211, 0.95) 0%, rgba(232, 213, 183, 0.95) 100%)',
                border: '3px solid #8b6914',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <X size={28} color="#3d2817" />
            </button>

            {/* Medal Icon */}
            <div className="flex justify-center mb-6">
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  background: 'linear-gradient(135deg, #f4d03f 0%, #daa520 100%)',
                  border: '4px solid #8b6914',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.6), inset 0 4px 12px rgba(255, 255, 255, 0.4)'
                }}
              >
                <Award 
                  size={100} 
                  style={{
                    color: '#8b6914',
                    filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.8))',
                    strokeWidth: 2.5
                  }}
                />
              </div>
            </div>

            {/* Medal Description */}
            <div 
              className="text-center mb-6 px-6 py-4 rounded-lg"
              style={{
                background: 'rgba(255, 250, 235, 0.95)',
                border: '2px solid #8b6914',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h2 
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#3d2817',
                  marginBottom: '8px',
                  letterSpacing: '1px'
                }}
              >
                {selectedMedal.text || 'Milestone Achievement'}
              </h2>
              <p 
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1rem',
                  color: '#8b6914',
                  fontWeight: 600
                }}
              >
                Awakened on: {new Date(selectedMedal.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Cards Section */}
            {selectedMedal.cards && selectedMedal.cards.length > 0 && (
              <div 
                className="px-6 py-4 rounded-lg"
                style={{
                  background: 'rgba(232, 213, 183, 0.9)',
                  border: '2px solid #8b6914',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                }}
              >
                <h3 
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '1.3rem',
                    color: '#8b6914',
                    fontWeight: 700,
                    marginBottom: '16px',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                  }}
                >
                  Refined from {selectedMedal.cards.length} card{selectedMedal.cards.length > 1 ? 's' : ''}:
                </h3>

                <div className="flex flex-col gap-4">
                  {selectedMedal.cards.map((card, cardIndex) => (
                    <div 
                      key={card.id}
                      className="px-4 py-3 rounded-lg"
                      style={{
                        background: 'rgba(255, 250, 235, 0.9)',
                        border: '2px solid #d4af37'
                      }}
                    >
                      {/* Card info */}
                      <div 
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '1rem',
                          color: '#3d2817',
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}
                      >
                        Card #{cardIndex + 1}: {card.text || 'Untitled'}
                      </div>
                      <div 
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.85rem',
                          color: '#8b6914',
                          marginBottom: '12px'
                        }}
                      >
                        Created: {new Date(card.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>

                      {/* Ores in this card */}
                      {card.ores && card.ores.length > 0 && (
                        <div 
                          className="pl-4 pt-3 border-t-2 border-amber-300"
                        >
                          <div 
                            style={{
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.9rem',
                              color: '#8b6914',
                              fontWeight: 600,
                              marginBottom: '8px'
                            }}
                          >
                            Contains {card.ores.length} ore{card.ores.length > 1 ? 's' : ''}:
                          </div>
                          <div className="flex flex-col gap-2">
                            {card.ores.map((ore, oreIndex) => (
                              <div 
                                key={oreIndex}
                                className="px-3 py-2 rounded"
                                style={{
                                  background: 'rgba(245, 240, 230, 0.8)',
                                  border: '1px solid #d4af37'
                                }}
                              >
                                <div 
                                  style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: '0.75rem',
                                    color: '#8b6914',
                                    fontWeight: 600,
                                    marginBottom: '2px'
                                  }}
                                >
                                  {ore.date}
                                </div>
                                <div 
                                  style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: '0.8rem',
                                    color: '#3d2817',
                                    lineHeight: '1.3'
                                  }}
                                >
                                  {ore.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes owlFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
