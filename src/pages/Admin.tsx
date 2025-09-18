import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs, query, where, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { storage, db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Trash2, GripVertical, X, Search, Filter, Grid, List, Calendar, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { usePhotos, Photo } from '@/hooks/usePhotos';

const Admin = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Home page images state
  const [homeImages, setHomeImages] = useState<{[key: string]: string}>({
    building: '',
    people: '',
    nature: ''
  });
  const [homeImageFiles, setHomeImageFiles] = useState<{[key: string]: File | null}>({
    building: null,
    people: null,
    nature: null
  });
  const [isUploadingHome, setIsUploadingHome] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('people');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localPhotos, setLocalPhotos] = useState<{[key: string]: Photo[]}>({});
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'position'>('position');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Get photos for each category
  const { photos: peoplePhotos, loading: peopleLoading } = usePhotos('people');
  const { photos: buildingPhotos, loading: buildingLoading } = usePhotos('building');
  const { photos: naturePhotos, loading: natureLoading } = usePhotos('nature');
  
  // Update local photos when Firebase data changes
  useEffect(() => {
    setLocalPhotos({
      people: peoplePhotos,
      building: buildingPhotos,
      nature: naturePhotos
    });
  }, [peoplePhotos, buildingPhotos, naturePhotos]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      setUser(user);
      if (user) {
        fetchHomeImages();
      }
    });
    return unsubscribe;
  }, [navigate]);

  const fetchHomeImages = async () => {
    try {
      const homeImagesRef = collection(db, 'home_page_images');
      const querySnapshot = await getDocs(homeImagesRef);
      const images: {[key: string]: string} = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        images[data.category] = data.imageUrl;
      });
      
      setHomeImages(prev => ({ ...prev, ...images }));
    } catch (error) {
      console.error('Error fetching home images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !user) return;
    
    setIsUploading(true);
    
    try {
      // Get current auth token
      const token = await user.getIdToken();
      
      // Create storage reference
      const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
      
      // Custom metadata with auth token
      const metadata = {
        customMetadata: {
          owner: user.uid,
          token: token
        }
      };
      
      // Upload with error handling
      await uploadBytes(storageRef, file, metadata);
      const imageUrl = await getDownloadURL(storageRef);
      
      // Get current photos count for position
      const photosInCategory = getPhotosForCategory(category || activeCategory);
      const position = photosInCategory.length;
      
      // Save to Firestore
      console.log('Saving to Firestore:', { name, category, imageUrl });
      const docRef = await addDoc(collection(db, 'photos'), {
        name,
        category: category || activeCategory,
        imageUrl,
        uploadedBy: user.uid,
        position,
        createdAt: serverTimestamp()
      });
      console.log('Document written with ID:', docRef.id);
      
      // Create new photo object for immediate UI update
      const newPhoto: Photo = {
        id: docRef.id,
        name,
        category: (category || activeCategory) as 'building' | 'people' | 'nature',
        imageUrl,
        uploadedBy: user.uid,
        position,
        createdAt: new Date()
      };
      
      // Add to local state immediately
      setLocalPhotos(prev => ({
        ...prev,
        [category || activeCategory]: [...(prev[category || activeCategory] || []), newPhoto]
      }));
      
      // Reset form
      setName('');
      setCategory('');
      setFile(null);
      
      // Success feedback
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleHomeImageUpload = async (category: string) => {
    const file = homeImageFiles[category];
    if (!file || !user) return;

    setIsUploadingHome(true);
    
    try {
      const token = await user.getIdToken();
      const storageRef = ref(storage, `home_page_images/${category}_${Date.now()}.jpg`);
      
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      
      // Save to Firestore (overwrite existing document for this category)
      await setDoc(doc(db, 'home_page_images', category), {
        category,
        imageUrl,
        uploadedBy: user.uid,
        createdAt: serverTimestamp()
      });
      
      // Update local state
      setHomeImages(prev => ({ ...prev, [category]: imageUrl }));
      setHomeImageFiles(prev => ({ ...prev, [category]: null }));
      
      alert(`${category} home image updated successfully!`);
    } catch (error) {
      console.error('Home image upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingHome(false);
    }
  };

  const getPhotosForCategory = (category: string) => {
    // Use local photos for immediate updates, fallback to Firebase data
    const photos = localPhotos[category] || [];
    if (photos.length === 0) {
      switch (category) {
        case 'people': return peoplePhotos;
        case 'building': return buildingPhotos;
        case 'nature': return naturePhotos;
        default: return [];
      }
    }
    return photos;
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    // Remove from local state immediately
    setLocalPhotos(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory]?.filter(photo => photo.id !== photoId) || []
    }));
    
    try {
      // Delete from Firestore
      await updateDoc(doc(db, 'photos', photoId), {
        deleted: true,
        deletedAt: serverTimestamp()
      });
      
      alert('Photo deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo');
      // On error, refresh to get correct state
      window.location.reload();
    }
  };

  const handleReorder = async (draggedId: string, targetIndex: number) => {
    const categoryPhotos = getPhotosForCategory(activeCategory);
    const draggedPhoto = categoryPhotos.find(p => p.id === draggedId);
    
    if (!draggedPhoto) return;
    
    // Optimistic UI update - reorder immediately
    const reorderedPhotos = [...categoryPhotos];
    const draggedIndex = reorderedPhotos.findIndex(p => p.id === draggedId);
    
    // Remove dragged item and insert at target position
    const [removed] = reorderedPhotos.splice(draggedIndex, 1);
    reorderedPhotos.splice(targetIndex, 0, removed);
    
    // Update positions locally for immediate UI feedback
    const updatedPhotos = reorderedPhotos.map((photo, index) => ({
      ...photo,
      position: index
    }));
    
    // Update local state immediately for live UI feedback
    setLocalPhotos(prev => ({
      ...prev,
      [activeCategory]: updatedPhotos
    }));
    
    try {
      const batch = writeBatch(db);
      
      // Update positions in Firebase
      updatedPhotos.forEach((photo, index) => {
        const photoRef = doc(db, 'photos', photo.id);
        batch.update(photoRef, { position: index });
      });
      
      await batch.commit();
      console.log('Photos reordered successfully');
      
    } catch (error) {
      console.error('Reorder failed:', error);
      alert('Failed to reorder photos');
      // On error, trigger a refresh to get the correct order from server
      window.location.reload();
    }
  };

  const getFilteredPhotos = () => {
    const photos = getPhotosForCategory(activeCategory);
    let filtered = photos;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
          new Date(a.createdAt?.toDate?.() || a.createdAt).getTime()
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.createdAt?.toDate?.() || a.createdAt).getTime() - 
          new Date(b.createdAt?.toDate?.() || b.createdAt).getTime()
        );
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'position':
      default:
        filtered = [...filtered].sort((a, b) => (a.position || 0) - (b.position || 0));
        break;
    }
    
    return filtered;
  };
  
  const getContainerClasses = () => {
    if (viewMode === 'list') {
      return 'space-y-2';
    }
    if (viewMode === 'timeline') {
      return 'space-y-4';
    }
    // Grid mode
    switch (gridSize) {
      case 'small': return 'grid grid-cols-4 gap-2';
      case 'large': return 'grid grid-cols-1 gap-4';
      case 'medium':
      default: return 'grid grid-cols-2 gap-4';
    }
  };
  
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedPhotos.size} photos?`)) return;
    
    try {
      const batch = writeBatch(db);
      
      selectedPhotos.forEach(photoId => {
        const photoRef = doc(db, 'photos', photoId);
        batch.update(photoRef, {
          deleted: true,
          deletedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      
      // Remove from local state
      setLocalPhotos(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory]?.filter(photo => !selectedPhotos.has(photo.id)) || []
      }));
      
      setSelectedPhotos(new Set());
      alert(`${selectedPhotos.size} photos deleted successfully!`);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete photos');
    }
  };
  
  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };
  
  const getImageClasses = () => {
    switch (gridSize) {
      case 'small': return 'h-16';
      case 'large': return 'h-48';
      case 'medium':
      default: return 'h-24';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-medium text-foreground">Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        {/* Home Page Images Section */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Home Page Images</h2>
          <p className="text-muted-foreground mb-6">Upload one image for each category to display on the homepage.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['building', 'people', 'nature'].map((category) => (
              <div key={category} className="border border-input rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3 capitalize">{category}</h3>
                
                {homeImages[category] && (
                  <div className="mb-4">
                    <img 
                      src={homeImages[category]} 
                      alt={`${category} home image`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setHomeImageFiles(prev => ({ ...prev, [category]: file }));
                    }}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-sepia file:text-white hover:file:bg-sepia/90"
                  />
                  
                  <Button
                    type="button"
                    onClick={() => handleHomeImageUpload(category)}
                    disabled={!homeImageFiles[category] || isUploadingHome}
                    className="w-full"
                    size="sm"
                  >
                    {isUploadingHome ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      `Update ${category} Image`
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Management Section */}
        <div className="border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Gallery Management</h2>
          
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-border">
            {['people', 'building', 'nature'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? 'border-b-2 border-sepia text-sepia'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-medium text-foreground">Upload New Photo</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Photo Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-input rounded-sm bg-background text-foreground"
                    placeholder="Enter photo name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <select
                    value={category || activeCategory}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-input rounded-sm bg-background text-foreground"
                    required
                  >
                    <option value="people">People</option>
                    <option value="building">Building</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Image File</label>
                  <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-sepia transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full bg-sepia hover:bg-sepia/90 text-white"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : 'Upload Photo'}
                </Button>
              </form>
            </div>

            {/* Photos Management */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-medium text-foreground capitalize">
                  {activeCategory} Photos ({getFilteredPhotos().length})
                </h3>
                
                {/* View Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex border border-input rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-sepia text-white' : 'hover:bg-muted'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-sepia text-white' : 'hover:bg-muted'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('timeline')}
                      className={`p-2 ${viewMode === 'timeline' ? 'bg-sepia text-white' : 'hover:bg-muted'}`}
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search photos by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Sort:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1 border border-input rounded bg-background text-sm"
                      >
                        <option value="position">Position</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name A-Z</option>
                      </select>
                    </div>
                    
                    {viewMode === 'grid' && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Size:</label>
                        <select
                          value={gridSize}
                          onChange={(e) => setGridSize(e.target.value as any)}
                          className="px-3 py-1 border border-input rounded bg-background text-sm"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    )}
                    
                    {selectedPhotos.size > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedPhotos.size} selected
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleBulkDelete}
                        >
                          Delete Selected
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPhotos(new Set())}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Photos Display */}
              <div className={`${getContainerClasses()} max-h-[600px] overflow-y-auto`}>
                {getFilteredPhotos().map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`relative group border rounded-lg overflow-hidden hover:shadow-md transition-all ${
                      dragOverIndex === index ? 'border-sepia border-2 bg-sepia/5' : 'border-input'
                    } ${
                      draggedItem === photo.id ? 'opacity-50 scale-95' : ''
                    }`}
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem(photo.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverIndex(index);
                    }}
                    onDragLeave={() => {
                      setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedItem && draggedItem !== photo.id) {
                        handleReorder(draggedItem, index);
                      }
                      setDraggedItem(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggedItem(null);
                      setDragOverIndex(null);
                    }}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.has(photo.id)}
                        onChange={() => togglePhotoSelection(photo.id)}
                        className="w-4 h-4 text-sepia bg-white border-2 border-white rounded focus:ring-sepia"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <img
                      src={photo.imageUrl}
                      alt={photo.name}
                      className={`w-full ${getImageClasses()} object-cover cursor-pointer hover:opacity-80 transition-opacity ${
                        selectedPhotos.has(photo.id) ? 'ring-2 ring-sepia' : ''
                      }`}
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{photo.name}</p>
                      <p className="text-xs text-muted-foreground">Position: {index + 1}</p>
                    </div>
                    
                    {/* Drag Handle */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {getFilteredPhotos().length === 0 && (
                  <div className={`${viewMode === 'grid' ? 'col-span-full' : ''} text-center py-8 text-muted-foreground`}>
                    {searchTerm ? (
                      <>
                        <p>No photos found matching "{searchTerm}"</p>
                        <p className="text-sm">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <p>No photos in this category yet.</p>
                        <p className="text-sm">Upload your first photo above!</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                <h3 className="font-medium text-lg">{selectedPhoto.name}</h3>
                <p className="text-sm text-gray-300 capitalize">{selectedPhoto.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
