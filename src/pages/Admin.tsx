import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { storage, db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
      
      // Save to Firestore
      console.log('Saving to Firestore:', { name, category, imageUrl });
      const docRef = await addDoc(collection(db, 'photos'), {
        name,
        category,
        imageUrl,
        uploadedBy: user.uid,
        createdAt: serverTimestamp()
      });
      console.log('Document written with ID:', docRef.id);
      
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

        {/* Regular Photo Upload Section */}
        <div className="border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Gallery Photos</h2>
          
          <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Photo Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-input rounded-sm bg-background text-foreground"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-input rounded-sm bg-background text-foreground"
              required
            >
              <option value="">Select a category</option>
              <option value="people">People</option>
              <option value="building">Building</option>
              <option value="nature">Nature</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Image File</label>
            <div className="border border-input rounded-sm p-3 bg-background">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-foreground"
                required
              />
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
      </div>
    </div>
  );
};

export default Admin;
