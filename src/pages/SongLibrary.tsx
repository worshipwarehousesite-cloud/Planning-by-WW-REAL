import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Music, Edit, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useData, Song } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const SongLibrary = () => {
  const { songs, addSong, updateSong, deleteSong } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [keyFilter, setKeyFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [newSong, setNewSong] = useState({
    title: '',
    authors: [''],
    key: '',
    tempo: '',
    lyrics: '',
    copyrightInfo: ''
  });

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKey = !keyFilter || song.key === keyFilter;
    return matchesSearch && matchesKey;
  });

  const handleCreateSong = () => {
    if (!newSong.title || !newSong.key) {
      toast({
        title: "Missing information",
        description: "Please fill in the title and key.",
        variant: "destructive",
      });
      return;
    }

    const songData = {
      ...newSong,
      authors: newSong.authors.filter(author => author.trim() !== ''),
      tempo: newSong.tempo ? parseInt(newSong.tempo) : undefined
    };

    addSong(songData);
    toast({
      title: "Song added",
      description: "The song has been added to your library.",
    });
    setIsCreating(false);
    setNewSong({
      title: '',
      authors: [''],
      key: '',
      tempo: '',
      lyrics: '',
      copyrightInfo: ''
    });
  };

  const handleEditSong = () => {
    if (!editingSong) return;

    const songData = {
      ...newSong,
      authors: newSong.authors.filter(author => author.trim() !== ''),
      tempo: newSong.tempo ? parseInt(newSong.tempo) : undefined
    };

    updateSong(editingSong.id, songData);
    toast({
      title: "Song updated",
      description: "The song has been updated successfully.",
    });
    setEditingSong(null);
    setNewSong({
      title: '',
      authors: [''],
      key: '',
      tempo: '',
      lyrics: '',
      copyrightInfo: ''
    });
  };

  const startEdit = (song: Song) => {
    setEditingSong(song);
    setNewSong({
      title: song.title,
      authors: song.authors.length > 0 ? song.authors : [''],
      key: song.key,
      tempo: song.tempo?.toString() || '',
      lyrics: song.lyrics || '',
      copyrightInfo: song.copyrightInfo || ''
    });
  };

  const handleDeleteSong = (songId: string) => {
    deleteSong(songId);
    toast({
      title: "Song deleted",
      description: "The song has been removed from your library.",
    });
  };

  const addAuthorField = () => {
    setNewSong({
      ...newSong,
      authors: [...newSong.authors, '']
    });
  };

  const updateAuthor = (index: number, value: string) => {
    const updatedAuthors = [...newSong.authors];
    updatedAuthors[index] = value;
    setNewSong({
      ...newSong,
      authors: updatedAuthors
    });
  };

  const removeAuthor = (index: number) => {
    if (newSong.authors.length > 1) {
      const updatedAuthors = newSong.authors.filter((_, i) => i !== index);
      setNewSong({
        ...newSong,
        authors: updatedAuthors
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <DashboardHeader 
            title="Song Library" 
            subtitle="Manage your church's song collection"
            actions={
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Song
              </Button>
            }
          />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search songs by title or author..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-48">
                      <Select value={keyFilter} onValueChange={setKeyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by key" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Keys</SelectItem>
                          {keys.map(key => (
                            <SelectItem key={key} value={key}>{key}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Songs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-purple-600" />
                          {song.title}
                        </CardTitle>
                        <CardDescription>
                          {song.authors.join(', ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Key:</span>
                            <span className="font-medium">{song.key}</span>
                          </div>
                          {song.tempo && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tempo:</span>
                              <span className="font-medium">{song.tempo} BPM</span>
                            </div>
                          )}
                          {song.copyrightInfo && (
                            <div className="text-xs text-gray-500 mt-2">
                              {song.copyrightInfo}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(song)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSong(song.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredSongs.length === 0 && (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center text-gray-500">
                      <Music className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No songs found</p>
                      <p className="text-sm">Try adjusting your search or add a new song</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Create/Edit Song Modal */}
              {(isCreating || editingSong) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {editingSong ? 'Edit Song' : 'Add New Song'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Song Title *</Label>
                        <Input
                          id="title"
                          value={newSong.title}
                          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                          placeholder="Enter song title"
                        />
                      </div>

                      <div>
                        <Label>Authors</Label>
                        {newSong.authors.map((author, index) => (
                          <div key={index} className="flex gap-2 mt-1">
                            <Input
                              value={author}
                              onChange={(e) => updateAuthor(index, e.target.value)}
                              placeholder="Author name"
                            />
                            {newSong.authors.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeAuthor(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addAuthorField}
                          className="mt-2"
                        >
                          Add Author
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="key">Key *</Label>
                          <Select value={newSong.key} onValueChange={(value) => setNewSong({ ...newSong, key: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select key" />
                            </SelectTrigger>
                            <SelectContent>
                              {keys.map(key => (
                                <SelectItem key={key} value={key}>{key}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tempo">Tempo (BPM)</Label>
                          <Input
                            id="tempo"
                            type="number"
                            value={newSong.tempo}
                            onChange={(e) => setNewSong({ ...newSong, tempo: e.target.value })}
                            placeholder="120"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lyrics">Lyrics</Label>
                        <Textarea
                          id="lyrics"
                          value={newSong.lyrics}
                          onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
                          placeholder="Enter song lyrics..."
                          rows={6}
                        />
                      </div>

                      <div>
                        <Label htmlFor="copyright">Copyright Information</Label>
                        <Input
                          id="copyright"
                          value={newSong.copyrightInfo}
                          onChange={(e) => setNewSong({ ...newSong, copyrightInfo: e.target.value })}
                          placeholder="© 2024 Publisher Name"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button onClick={editingSong ? handleEditSong : handleCreateSong}>
                        {editingSong ? 'Update Song' : 'Add Song'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCreating(false);
                          setEditingSong(null);
                          setNewSong({
                            title: '',
                            authors: [''],
                            key: '',
                            tempo: '',
                            lyrics: '',
                            copyrightInfo: ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SongLibrary;