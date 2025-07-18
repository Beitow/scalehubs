import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface User {
    id: string
    name: string
    email: string
    company: string
    role: 'admin' | 'client'
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string, userData: any) => Promise<void>
    logout: () => void
    clearError: () => void
}

// Usuarios de prueba
const mockUsers: User[] = [
    {
        id: '1',
        name: 'Administrador ScaleHubs',
        email: 'admin@scalehubs.com',
        company: 'ScaleHubs',
        role: 'admin'
    },
    {
        id: '2',
        name: 'Juan Pérez',
        email: 'juan@empresa1.com',
        company: 'Empresa 1',
        role: 'client'
    },
    {
        id: '3',
        name: 'María García',
        email: 'maria@empresa2.com',
        company: 'Empresa 2',
        role: 'client'
    }
]

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                login: async (email: string, password: string) => {
                    set({ isLoading: true, error: null })

                    try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 1000))

                        // Buscar usuario en la lista de usuarios de prueba
                        const user = mockUsers.find(u => u.email === email)

                        if (user && password === 'password') {
                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null
                            })
                        } else {
                            throw new Error('Credenciales inválidas')
                        }
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'Error al iniciar sesión'
                        })
                    }
                },

                signup: async (email: string, password: string, userData: any) => {
                    set({ isLoading: true, error: null })

                    try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 1000))

                        // Verificar si el email ya existe
                        const existingUser = mockUsers.find(u => u.email === email)
                        if (existingUser) {
                            throw new Error('El email ya está registrado')
                        }

                        // Crear nuevo usuario
                        const newUser: User = {
                            id: (mockUsers.length + 1).toString(),
                            name: userData.name,
                            email: email,
                            company: userData.company,
                            role: 'client'
                        }

                        // En un caso real, aquí se guardaría en la base de datos
                        // mockUsers.push(newUser)

                        set({
                            user: newUser,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        })
                    } catch (error) {
                        set({
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'Error al crear la cuenta'
                        })
                    }
                },

                logout: () => {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    })
                },

                clearError: () => {
                    set({ error: null })
                }
            }),
            {
                name: 'auth-storage', // name of the item in localStorage
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                }), // only persist these fields
            }),
            {
                name: 'AuthStore',
            }

    )
)