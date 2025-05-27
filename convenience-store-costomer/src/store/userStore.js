import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      currentUser: null,
      users: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (newUser) => set((state) => ({
        users: [...state.users, { ...newUser, points: 0 }],
        currentUser: { ...newUser, points: 0 }
      })),
      updateUserAvatar: (avatar) => set((state) => {
        if (!state.currentUser) return state;
        
        const updatedUsers = state.users.map(user => 
          user.email === state.currentUser.email 
            ? { ...user, avatar }
            : user
        );
        
        return {
          users: updatedUsers,
          currentUser: { ...state.currentUser, avatar }
        };
      }),
      login: (email, password) => set((state) => {
        const user = state.users.find(u => u.email === email && u.password === password);
        if (!user) return state;
        // Ensure points is a number
        const userWithPoints = {
          ...user,
          points: Number(user.points || 0)
        };
        return { currentUser: userWithPoints };
      }),
      loginWithGoogle: (googleUser) => set((state) => {
        let user = state.users.find(u => u.email === googleUser.email);
        
        if (!user) {
          // Create new user if doesn't exist
          user = {
            email: googleUser.email,
            username: googleUser.name,
            points: 0,
            googleId: googleUser.sub
          };
          return {
            users: [...state.users, user],
            currentUser: user
          };
        }
        
        // Update existing user with Google info
        const updatedUser = {
          ...user,
          googleId: googleUser.sub,
          points: Number(user.points || 0)
        };
        
        const updatedUsers = state.users.map(u => 
          u.email === googleUser.email ? updatedUser : u
        );
        
        return {
          users: updatedUsers,
          currentUser: updatedUser
        };
      }),
      logout: () => set({ currentUser: null }),
      updatePoints: (points) => set((state) => {
        if (!state.currentUser) return state;
        
        const updatedUsers = state.users.map(user => 
          user.email === state.currentUser.email 
            ? { ...user, points: Number(user.points || 0) + Number(points || 0) }
            : user
        );
        
        return {
          users: updatedUsers,
          currentUser: { 
            ...state.currentUser, 
            points: Number(state.currentUser.points || 0) + Number(points || 0) 
          }
        };
      }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore; 