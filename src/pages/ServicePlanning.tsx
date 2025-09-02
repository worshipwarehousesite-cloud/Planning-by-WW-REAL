import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Music, Users, GripVertical, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useData, Service, ServiceBlock } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockProps {
  block: ServiceBlock;
  onEdit: (block: ServiceBlock) => void;
  onDelete: (blockId: string) => void;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ block, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {block.type === 'song' ? (
            <Music className="h-4 w-4 text-purple-600" />
          ) : (
            <Calendar className="h-4 w-4 text-blue-600" />
          )}
          <h4 className="font-medium">{block.title}</h4>
          {block.duration && (
            <span className="text-sm text-gray-500">({block.duration} min)</span>
          )}
        </div>
        
        {block.assignedVolunteers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {block.assignedVolunteers.map((assignment, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {assignment.role}
              </span>
            ))}
          </div>
        )}
        
        {block.notes && (
          <p className="text-sm text-gray-600 mt-1">{block.notes}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(block)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(block.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ServicePlanning = () => {
  const { services, songs, volunteers, addService, updateService, deleteService } = useData();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    date: '',
    time: '',
    blocks: [] as ServiceBlock[]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && selectedService) {
      const oldIndex = selectedService.blocks.findIndex(block => block.id === active.id);
      const newIndex = selectedService.blocks.findIndex(block => block.id === over.id);

      const newBlocks = arrayMove(selectedService.blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index + 1
      }));

      const updatedService = { ...selectedService, blocks: newBlocks };
      setSelectedService(updatedService);
      updateService(selectedService.id, { blocks: newBlocks });
    }
  };

  const handleCreateService = () => {
    if (!newService.name || !newService.date || !newService.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addService(newService);
    toast({
      title: "Service created",
      description: "Your new service has been created successfully.",
    });
    setIsCreating(false);
    setNewService({ name: '', date: '', time: '', blocks: [] });
  };

  const addBlock = (type: 'song' | 'custom') => {
    if (!selectedService) return;

    const newBlock: ServiceBlock = {
      id: Date.now().toString(),
      type,
      title: type === 'song' ? 'Select Song' : 'New Block',
      assignedVolunteers: [],
      order: selectedService.blocks.length + 1
    };

    const updatedBlocks = [...selectedService.blocks, newBlock];
    const updatedService = { ...selectedService, blocks: updatedBlocks };
    setSelectedService(updatedService);
    updateService(selectedService.id, { blocks: updatedBlocks });
  };

  const deleteBlock = (blockId: string) => {
    if (!selectedService) return;

    const updatedBlocks = selectedService.blocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index + 1 }));
    
    const updatedService = { ...selectedService, blocks: updatedBlocks };
    setSelectedService(updatedService);
    updateService(selectedService.id, { blocks: updatedBlocks });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <DashboardHeader 
            title="Service Planning" 
            subtitle="Plan and organize your worship services"
            actions={
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Button>
            }
          />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Services</CardTitle>
                      <CardDescription>Select a service to edit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedService?.id === service.id
                                ? 'bg-blue-50 border-blue-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(service.date).toLocaleDateString()} at {service.time}
                            </p>
                            <p className="text-xs text-gray-500">
                              {service.blocks.length} blocks
                            </p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service Editor */}
                <div className="lg:col-span-2">
                  {selectedService ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {selectedService.name}
                        </CardTitle>
                        <CardDescription>
                          {new Date(selectedService.date).toLocaleDateString()} at {selectedService.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => addBlock('song')}
                            >
                              <Music className="h-4 w-4 mr-2" />
                              Add Song
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => addBlock('custom')}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Block
                            </Button>
                          </div>

                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={selectedService.blocks.map(block => block.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {selectedService.blocks.map((block) => (
                                  <SortableBlock
                                    key={block.id}
                                    block={block}
                                    onEdit={() => {}}
                                    onDelete={deleteBlock}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>

                          {selectedService.blocks.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>No blocks added yet</p>
                              <p className="text-sm">Add songs or custom blocks to get started</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Select a service to start planning</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Create Service Modal */}
              {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                  >
                    <h3 className="text-lg font-semibold mb-4">Create New Service</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="serviceName">Service Name</Label>
                        <Input
                          id="serviceName"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          placeholder="Sunday Morning Service"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceDate">Date</Label>
                        <Input
                          id="serviceDate"
                          type="date"
                          value={newService.date}
                          onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceTime">Time</Label>
                        <Input
                          id="serviceTime"
                          type="time"
                          value={newService.time}
                          onChange={(e) => setNewService({ ...newService, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button onClick={handleCreateService}>Create Service</Button>
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
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

export default ServicePlanning;