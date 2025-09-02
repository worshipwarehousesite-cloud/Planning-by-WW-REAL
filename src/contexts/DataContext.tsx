import React, { createContext, useContext, useState } from 'react';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  roles: string[];
  teams: string[];
  blockoutDates: string[];
  phone?: string;
}

export interface Song {
  id: string;
  title: string;
  authors: string[];
  key: string;
  tempo?: number;
  lyrics?: string;
  copyrightInfo?: string;
  arrangements?: Array<{
    id: string;
    name: string;
    key: string;
    notes?: string;
  }>;
}

export interface ServiceBlock {
  id: string;
  type: 'song' | 'custom';
  title: string;
  songId?: string;
  assignedVolunteers: Array<{
    volunteerId: string;
    role: string;
  }>;
  notes?: string;
  duration?: number;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  date: string;
  time: string;
  blocks: ServiceBlock[];
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  roles: string[];
}

interface DataContextType {
  volunteers: Volunteer[];
  songs: Song[];
  services: Service[];
  teams: Team[];
  addVolunteer: (volunteer: Omit<Volunteer, 'id'>) => void;
  updateVolunteer: (id: string, volunteer: Partial<Volunteer>) => void;
  deleteVolunteer: (id: string) => void;
  addSong: (song: Omit<Song, 'id'>) => void;
  updateSong: (id: string, song: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      roles: ['Vocals', 'Piano'],
      teams: ['Worship Team A'],
      blockoutDates: ['2024-01-15', '2024-02-10'],
      phone: '(555) 123-4567'
    },
    {
      id: '2',
      name: 'Mike Davis',
      email: 'mike@example.com',
      roles: ['Guitar', 'Bass'],
      teams: ['Worship Team B'],
      blockoutDates: ['2024-01-22'],
      phone: '(555) 987-6543'
    }
  ]);

  const [songs, setSongs] = useState<Song[]>([
    {
      id: '1',
      title: 'Amazing Grace',
      authors: ['John Newton'],
      key: 'G',
      tempo: 80,
      lyrics: 'Amazing grace, how sweet the sound...',
      copyrightInfo: 'Public Domain'
    },
    {
      id: '2',
      title: 'How Great Is Our God',
      authors: ['Chris Tomlin', 'Jesse Reeves', 'Ed Cash'],
      key: 'C',
      tempo: 76,
      copyrightInfo: '© 2004 Worship Together Music'
    }
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Sunday Morning Service',
      date: '2024-01-21',
      time: '10:00',
      blocks: [
        {
          id: '1',
          type: 'custom',
          title: 'Welcome & Announcements',
          assignedVolunteers: [],
          order: 1,
          duration: 5
        },
        {
          id: '2',
          type: 'song',
          title: 'Amazing Grace',
          songId: '1',
          assignedVolunteers: [
            { volunteerId: '1', role: 'Vocals' },
            { volunteerId: '2', role: 'Guitar' }
          ],
          order: 2,
          duration: 4
        }
      ]
    }
  ]);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Worship Team A',
      members: ['1'],
      roles: ['Vocals', 'Piano', 'Guitar', 'Bass', 'Drums']
    },
    {
      id: '2',
      name: 'Worship Team B',
      members: ['2'],
      roles: ['Vocals', 'Guitar', 'Bass', 'Drums', 'Keys']
    }
  ]);

  const addVolunteer = (volunteer: Omit<Volunteer, 'id'>) => {
    const newVolunteer = { ...volunteer, id: Date.now().toString() };
    setVolunteers([...volunteers, newVolunteer]);
  };

  const updateVolunteer = (id: string, volunteerUpdate: Partial<Volunteer>) => {
    setVolunteers(volunteers.map(v => v.id === id ? { ...v, ...volunteerUpdate } : v));
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers(volunteers.filter(v => v.id !== id));
  };

  const addSong = (song: Omit<Song, 'id'>) => {
    const newSong = { ...song, id: Date.now().toString() };
    setSongs([...songs, newSong]);
  };

  const updateSong = (id: string, songUpdate: Partial<Song>) => {
    setSongs(songs.map(s => s.id === id ? { ...s, ...songUpdate } : s));
  };

  const deleteSong = (id: string) => {
    setSongs(songs.filter(s => s.id !== id));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices([...services, newService]);
  };

  const updateService = (id: string, serviceUpdate: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...serviceUpdate } : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = { ...team, id: Date.now().toString() };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, teamUpdate: Partial<Team>) => {
    setTeams(teams.map(t => t.id === id ? { ...t, ...teamUpdate } : t));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  return (
    <DataContext.Provider value={{
      volunteers, songs, services, teams,
      addVolunteer, updateVolunteer, deleteVolunteer,
      addSong, updateSong, deleteSong,
      addService, updateService, deleteService,
      addTeam, updateTeam, deleteTeam
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};