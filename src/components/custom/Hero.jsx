// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Hero() {
  // Variantes pour les animations Framer Motion
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.8 } }
  }

  const imageVariants = (delay) => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, delay } }
  })

  // Hook de framer motion pour n'appliquer les animations qu'à partir de la taille md
  const shouldAnimate = window.innerWidth >= 768;

  return (
    <div className='relative isolate w-full h-screen flex items-center justify-center overflow-hidden'>
      {/* Quadrillage en arrière-plan */}
      <svg className="absolute dark:opacity-20 inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-black/10 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]" aria-hidden="true">
        <defs>
          <pattern id="background-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
            <path d="M.5 200V.5H200" fill="none"></path>
          </pattern>
        </defs>
        <svg x="50%" y="-1" className="overflow-visible fill-purple-50">
          <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" strokeWidth="0"></path>
        </svg>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#background-pattern)"></rect>
      </svg>

      {/* Gradient en arrière-plan */}
      <div className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48" aria-hidden="true">
        <div className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)' }}></div>
      </div>

      {/* Section principale centrée */}
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-40 sm:pt-32 lg:px-8 lg:pt-10 flex flex-col lg:flex-row items-center justify-center gap-x-10">
        {/* Titre avec animation uniquement sur tablette et desktop */}
        {shouldAnimate ? (
          <motion.div 
            className="max-w-2xl lg:max-w-none lg:flex lg:items-center"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl pr-5 lg:pr-10 mr-20">
              {/* Titre principal */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white/80 mt-10 sm:mt-0">
                Bienvenue sur <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>EasyTrip</span>
              </h1>

              {/* Sous-titre */}
              <p className="mt-6 text-md sm:text-lg lg:text-xl leading-8 text-slate-700 dark:text-white/60 sm:max-w-md lg:max-w-none">
                La plateforme ultime pour créer vos roadtrips par IA
              </p>

              {/* Bouton */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Link to={'/create-trip'}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-sm sm:text-base font-medium py-2 xl:py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500">
                    Explorez Maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl lg:max-w-none lg:flex lg:items-center">
            <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl pr-5 lg:pr-10">
              {/* Titre principal sans animation */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white/80 mt-10 sm:mt-0">
                Bienvenue sur EasyTrip
              </h1>

              {/* Sous-titre */}
              <p className="mt-6 text-md sm:text-lg lg:text-xl leading-8 text-slate-700 dark:text-white/60 sm:max-w-md lg:max-w-none">
                La plateforme ultime pour créer vos roadtrips par IA !
              </p>

              {/* Bouton */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Link to={'/create-trip'}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-sm sm:text-base font-medium py-2 xl:py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500">
                    Explorez Maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Section des images avec animation uniquement à partir de md */}
        <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
          <div className="ml-auto w-40 sm:w-56 md:w-48 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80 xl:w-60">
            <motion.div 
              className="relative"
              initial={shouldAnimate ? "hidden" : "visible"}
              animate={shouldAnimate ? "visible" : "visible"}
              variants={imageVariants(0.2)}
            >
              <img
                src="https://images.pexels.com/photos/62600/pexels-photo-62600.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Voyage montagne"
                className="aspect-square w-full rounded-xl bg-slate-100 object-cover shadow-lg"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={shouldAnimate ? "hidden" : "visible"}
              animate={shouldAnimate ? "visible" : "visible"}
              variants={imageVariants(0.4)}
            >
              <img
                src="https://images.pexels.com/photos/1076240/pexels-photo-1076240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Voyage nature"
                className="aspect-square w-full rounded-xl bg-slate-100 object-cover shadow-lg"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </motion.div>
          </div>

          <div className="mr-auto w-40 sm:w-56 md:w-48 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36 xl:w-60">
            <motion.div 
              className="relative"
              initial={shouldAnimate ? "hidden" : "visible"}
              animate={shouldAnimate ? "visible" : "visible"}
              variants={imageVariants(0.6)}
            >
              <img
                src="https://images.pexels.com/photos/9956949/pexels-photo-9956949.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Voyage ville"
                className="aspect-square w-full rounded-xl bg-slate-100 object-cover shadow-lg"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={shouldAnimate ? "hidden" : "visible"}
              animate={shouldAnimate ? "visible" : "visible"}
              variants={imageVariants(0.8)}
            >
              <img
                src="https://images.pexels.com/photos/2215380/pexels-photo-2215380.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Voyage roadtrip"
                className="aspect-square w-full rounded-xl bg-slate-100 object-cover shadow-lg"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
