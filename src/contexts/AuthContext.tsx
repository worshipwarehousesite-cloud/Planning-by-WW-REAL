import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer';
  churchId: string;
}

interface Church {
  id: string;
  name: string;
  denomination?: string;
  size?: string;
  adminName: string;
  adminEmail: string;
  howDidYouHear?: string;
}

interface AuthContextType {
  user: User | null;
  church: Church | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (churchData: Omit<Church, 'id'>, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [church, setChurch] = useState<Church | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    const savedChurch = localStorage.getItem('church');
    
    if (savedUser && savedChurch) {
      setUser(JSON.parse(savedUser));
      setChurch(JSON.parse(savedChurch));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    const mockUser: User = {
      id: '1',
      name: 'John Smith',
      email: email,
      role: email.includes('admin') ? 'admin' : 'volunteer',
      churchId: 'church-1'
    };
    
    const mockChurch: Church = {
      id: 'church-1',
      name: 'Grace Community Church',
      denomination: 'Non-denominational',
      size: '200-500',
      adminName: 'John Smith',
      adminEmail: email,
      howDidYouHear: 'Google Search'
    };
    
    setUser(mockUser);
    setChurch(mockChurch);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('church', JSON.stringify(mockChurch));
    
    setIsLoading(false);
    return true;
  };

  const register = async (churchData: Omit<Church, 'id'>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newChurch: Church = {
      ...churchData,
      id: `church-${Date.now()}`
    };
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: churchData.adminName,
      email: churchData.adminEmail,
      role: 'admin',
      churchId: newChurch.id
    };
    
    setUser(newUser);
    setChurch(newChurch);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('church', JSON.stringify(newChurch));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setChurch(null);
    localStorage.removeItem('user');
    localStorage.removeItem('church');
  };

  return (
    <AuthContext.Provider value={{ user, church, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};