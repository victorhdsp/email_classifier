import { GatewayService } from './shared/services/GatewayService'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const gatewayService = new GatewayService(BASE_URL)
