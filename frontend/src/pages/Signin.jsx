// Login.jsx
import React, { useState } from "react";
import { loginWithGoogle, loginWithGithub, loginWithEmail, auth } from "../services/auth.js";
import { onAuthStateChanged } from "firebase/auth";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      console.log("Google user:", result.user);
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await loginWithGithub();
      console.log("GitHub user:", result.user);
    } catch (error) {
      console.error("GitHub login error:", error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginWithEmail(email, password);
      console.log("Email user:", result.user);
    } catch (error) {
      console.error("Email login error:", error.message);
    }
  };

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-sans">
        {/* Main Card */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="p-8">
            {user ? (
              /* Logged In State */
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-orange-500 rounded-full blur opacity-30"></div>
                  <img 
                    src={user.photoURL || "https://via.placeholder.com/100"} 
                    alt="avatar" 
                    className="relative w-24 h-24 rounded-full border-2 border-orange-500 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome back,</h2>
                  <p className="text-orange-500 font-medium text-lg">
                    {user.displayName || user.email}
                  </p>
                </div>
                <button className="mt-4 px-6 py-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg transition-colors">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              /* Login State */
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Login</h2>
                  <p className="text-zinc-400 mt-2">Access your account to continue</p>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-zinc-700 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all active:scale-95"
                  >
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button 
                    onClick={handleGithubLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-zinc-700 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all active:scale-95"
                  >
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-widest">Or email</span>
                  <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-black font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98]"
                  >
                    Login to Account
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {/* Subtle Footer Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600"></div>
        </div>
      </div>
    );
};

export default Signin;