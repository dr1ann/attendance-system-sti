//Import the Skeleton Loaders
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from 'react-loading-skeleton';

// Images
import profile from '@/app/Images/profile.png'



const SidePageLoader = () => {
  return (
    
    
      <SkeletonTheme baseColor="#f2f2f2" highlightColor="#ffffff">
        <Skeleton style={{ height: '100vh', width: '95%', marginLeft:'auto', marginRight:'auto', display:'flex'}} className=" px-0 py-4 overflow-y-auto mt-[3em] sm:mt-[4em] rounded-lg" />
        </SkeletonTheme >
        
    
  );
}

export default SidePageLoader;
