import { Button } from '../ui/button'
import { Link } from 'react-router-dom'


function Hero() {
  return (
    <div className='relative w-full h-screen'>
      <video
        autoPlay
        loop
        muted
        className='absolute top-0 left-0 w-full h-full object-cover'
        aria-hidden="true"
      >
        <source src="/test.mov" type="video/mp4" />
      </video>
      <div className='relative z-10 flex flex-col items-center justify-center h-full text-center gap-9'>
      <div className='bg-black bg-opacity-70 backdrop-blur-sm p-8 rounded-lg animate-fade-in'>
          <h1 className='font-extrabold text-[50px] capitalize text-white animate-slide-in'>
            <span className='text-[#f56551]'>Explorez de nouvelles aventures avec EasyTrip</span>
            <br /> Des itinéraires sur mesure en un clic.
          </h1>
          <p className='text-xl text-gray-300 mt-4 animate-fade-in-delay'>
            Planifiez votre voyage idéal avec des itinéraires personnalisés qui répondent à vos goûts et à votre budget.
          </p>
          <Link to={'/create-trip'}>
            <Button className="hover:bg-[#f56551] border-solid border-2 border-[#f56551] bg-transparent mt-6">Commencer</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
