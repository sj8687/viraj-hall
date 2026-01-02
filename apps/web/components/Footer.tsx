
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { IoCallSharp } from 'react-icons/io5';
import { FaBug } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-[#0A0A23] text-white py-12">
      {/* <div className="cursor pointer-events-none z-[9999] h-[20px] w-[20px]  shadow-[0_0_10px_rgba(900,00,00,1000)] bg-fuchsia-800  rounded-full fixed top-0 left-0"></div> */}

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Viraj Multipurpose Hall</h3>
            <p className="text-sm mb-4">Creating unforgettable memories for your special events.</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                <FaWhatsapp size={24} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <FaFacebook size={24} />
              </a>
            </div>
          </div>

          {/* <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul>
              <li><a href="/about" className="hover:text-gray-400">About Us</a></li>
              <li><a href="/services" className="hover:text-gray-400">Services</a></li>
              <li><a href="/gallery" className="hover:text-gray-400">Gallery</a></li>
              <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
            </ul>
          </div> */}

          <div className=' sm:ml-[20%]'>
            <h4 className="text-xl font-semibold mb-4 ">Contact Us</h4>
            <div className="flex items-center space-x-2 mb-4">
              <IoCallSharp size={20} className="text-green-500" />
              <span className="text-sm">+123 456 7890</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <HiMail size={20} className="text-yellow-500" />
              <span className="text-sm">Viraj@Gmail.com</span>
            </div>
             <div className="flex items-center space-x-2 mb-4">
              <FaBug
                size={20} className="text-red-500" />
              <Link href="/nav/bug" className="text-sm">
                Report a Bug
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h4>
            <p className="text-sm mb-4">Get the latest updates and offers delivered to your inbox.</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-4 rounded-md border-2 border-gray-600 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button className="w-full p-0 bg-orange-600 py-2 rounded-md hover:bg-orange-700 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>

        <div className="text-center mt-12 border-t border-gray-700 pt-6">
          <p className="text-sm">© 2025 Viraj Multipurpose  Hall. All rights reserved.</p>
          <p className="text-sm">
            <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a> |{' '}
            <a href="/terms" className="hover:text-gray-400">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;