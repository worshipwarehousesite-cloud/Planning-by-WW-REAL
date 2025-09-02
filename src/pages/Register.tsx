import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Church, Mail, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    churchName: '',
    adminName: '',
    adminEmail: '',
    denomination: '',
    churchSize: '',
    howDidYouHear: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const churchData = {
        name: formData.churchName,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        denomination: formData.denomination || undefined,
        size: formData.churchSize || undefined,
        howDidYouHear: formData.howDidYouHear || undefined,
      };

      const success = await register(churchData, formData.password);
      
      if (success) {
        toast({
          title: "Welcome to Planning by Worship Warehouse!",
          description: "Your church account has been created successfully.",
        });
        navigate('/admin');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Church className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Register Your Church</h1>
            </div>
            <p className="text-gray-600">Get started with your worship planning platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="churchName">Church Name *</Label>
                <div className="relative mt-1">
                  <Church className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="churchName"
                    value={formData.churchName}
                    onChange={(e) => handleChange('churchName', e.target.value)}
                    className="pl-10"
                    placeholder="Enter church name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adminName">Admin Name *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="adminName"
                    value={formData.adminName}
                    onChange={(e) => handleChange('adminName', e.target.value)}
                    className="pl-10"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="adminEmail">Admin Email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="denomination">Denomination</Label>
                <Select onValueChange={(value) => handleChange('denomination', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select denomination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baptist">Baptist</SelectItem>
                    <SelectItem value="methodist">Methodist</SelectItem>
                    <SelectItem value="presbyterian">Presbyterian</SelectItem>
                    <SelectItem value="pentecostal">Pentecostal</SelectItem>
                    <SelectItem value="non-denominational">Non-denominational</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="churchSize">Church Size</Label>
                <Select onValueChange={(value) => handleChange('churchSize', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select church size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50">Under 50</SelectItem>
                    <SelectItem value="50-100">50-100</SelectItem>
                    <SelectItem value="100-200">100-200</SelectItem>
                    <SelectItem value="200-500">200-500</SelectItem>
                    <SelectItem value="500-1000">500-1000</SelectItem>
                    <SelectItem value="over-1000">Over 1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
              <Select onValueChange={(value) => handleChange('howDidYouHear', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                  <SelectItem value="conference">Conference/Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="mt-1"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="mt-1"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Church Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;