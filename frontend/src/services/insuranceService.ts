import { api } from './api';

export interface Insurance {
  id: string;
  type: 'auto' | 'home' | 'pet' | 'life' | 'pension' | 'health' | 'travel';
  name: string;
  provider: string;
  policyNumber: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  premiumFrequency: 'monthly' | 'quarterly' | 'yearly';
  coverage: {
    amount: number;
    currency: string;
    details: string;
  };
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  documents: InsuranceDocument[];
  claims: InsuranceClaim[];
  beneficiaries?: string[];
  vehicleInfo?: VehicleInfo;
  propertyInfo?: PropertyInfo;
  petInfo?: PetInfo;
}

export interface InsuranceDocument {
  id: string;
  name: string;
  type: 'policy' | 'certificate' | 'claim' | 'receipt' | 'other';
  url: string;
  uploadDate: Date;
  size: number;
}

export interface InsuranceClaim {
  id: string;
  insuranceId: string;
  type: 'damage' | 'theft' | 'accident' | 'illness' | 'death' | 'other';
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  date: Date;
  documents: InsuranceDocument[];
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  engineSize: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}

export interface PropertyInfo {
  address: string;
  type: 'house' | 'apartment' | 'condo' | 'commercial';
  squareMeters: number;
  constructionYear: number;
  propertyValue: number;
  securityFeatures: string[];
}

export interface PetInfo {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  age: number;
  weight: number;
  microchipNumber?: string;
}

export interface CreateInsuranceRequest {
  type: Insurance['type'];
  name: string;
  provider: string;
  policyNumber: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  premiumFrequency: Insurance['premiumFrequency'];
  coverage: {
    amount: number;
    currency: string;
    details: string;
  };
  vehicleInfo?: VehicleInfo;
  propertyInfo?: PropertyInfo;
  petInfo?: PetInfo;
  beneficiaries?: string[];
}

class InsuranceService {
  // Get all insurances
  async getInsurances(): Promise<Insurance[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockInsurances: Insurance[] = [
        {
          id: '1',
          type: 'auto',
          name: 'Auto Insurance - BMW X5',
          provider: 'Allianz',
          policyNumber: 'AUTO-2024-001',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          premium: 1200,
          premiumFrequency: 'yearly',
          coverage: {
            amount: 50000,
            currency: 'EUR',
            details: 'Comprehensive coverage including collision, theft, and third-party liability',
          },
          status: 'active',
          documents: [
            {
              id: '1',
              name: 'Policy Document',
              type: 'policy',
              url: '/documents/auto-policy.pdf',
              uploadDate: new Date('2024-01-01'),
              size: 1024000,
            },
          ],
          claims: [],
          vehicleInfo: {
            make: 'BMW',
            model: 'X5',
            year: 2022,
            licensePlate: 'AB123CD',
            vin: 'WBA5A7C50FD123456',
            color: 'Black',
            engineSize: '3.0L',
            fuelType: 'diesel',
          },
        },
        {
          id: '2',
          type: 'home',
          name: 'Home Insurance - Via Roma 123',
          provider: 'Generali',
          policyNumber: 'HOME-2024-002',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          premium: 800,
          premiumFrequency: 'yearly',
          coverage: {
            amount: 300000,
            currency: 'EUR',
            details: 'Building and contents coverage, natural disasters, theft',
          },
          status: 'active',
          documents: [
            {
              id: '2',
              name: 'Home Policy',
              type: 'policy',
              url: '/documents/home-policy.pdf',
              uploadDate: new Date('2024-01-01'),
              size: 2048000,
            },
          ],
          claims: [],
          propertyInfo: {
            address: 'Via Roma 123, Milano',
            type: 'apartment',
            squareMeters: 120,
            constructionYear: 2010,
            propertyValue: 350000,
            securityFeatures: ['Alarm System', 'Security Cameras', 'Intercom'],
          },
        },
        {
          id: '3',
          type: 'pet',
          name: 'Pet Insurance - Luna',
          provider: 'Petplan',
          policyNumber: 'PET-2024-003',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          premium: 300,
          premiumFrequency: 'yearly',
          coverage: {
            amount: 5000,
            currency: 'EUR',
            details: 'Veterinary expenses, surgery, medications',
          },
          status: 'active',
          documents: [
            {
              id: '3',
              name: 'Pet Policy',
              type: 'policy',
              url: '/documents/pet-policy.pdf',
              uploadDate: new Date('2024-01-01'),
              size: 512000,
            },
          ],
          claims: [],
          petInfo: {
            name: 'Luna',
            species: 'dog',
            breed: 'Golden Retriever',
            age: 3,
            weight: 25,
            microchipNumber: '123456789012345',
          },
        },
        {
          id: '4',
          type: 'life',
          name: 'Life Insurance - Term Life',
          provider: 'Unipol',
          policyNumber: 'LIFE-2024-004',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2034-01-01'),
          premium: 600,
          premiumFrequency: 'yearly',
          coverage: {
            amount: 500000,
            currency: 'EUR',
            details: 'Term life insurance for 10 years',
          },
          status: 'active',
          documents: [
            {
              id: '4',
              name: 'Life Policy',
              type: 'policy',
              url: '/documents/life-policy.pdf',
              uploadDate: new Date('2024-01-01'),
              size: 1536000,
            },
          ],
          claims: [],
          beneficiaries: ['Maria Rossi', 'Giuseppe Rossi'],
        },
        {
          id: '5',
          type: 'pension',
          name: 'Pension Fund - Private Pension',
          provider: 'Intesa Sanpaolo',
          policyNumber: 'PENSION-2024-005',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2054-01-01'),
          premium: 2400,
          premiumFrequency: 'yearly',
          coverage: {
            amount: 0,
            currency: 'EUR',
            details: 'Private pension fund with monthly contributions',
          },
          status: 'active',
          documents: [
            {
              id: '5',
              name: 'Pension Contract',
              type: 'policy',
              url: '/documents/pension-contract.pdf',
              uploadDate: new Date('2024-01-01'),
              size: 3072000,
            },
          ],
          claims: [],
        },
      ];
      
      return mockInsurances;
    } catch (error) {
      throw new Error('Failed to fetch insurances');
    }
  }

  // Get insurance by ID
  async getInsurance(id: string): Promise<Insurance> {
    try {
      const insurances = await this.getInsurances();
      const insurance = insurances.find(i => i.id === id);
      if (!insurance) {
        throw new Error('Insurance not found');
      }
      return insurance;
    } catch (error) {
      throw new Error('Failed to fetch insurance');
    }
  }

  // Get insurances by type
  async getInsurancesByType(type: Insurance['type']): Promise<Insurance[]> {
    try {
      const insurances = await this.getInsurances();
      return insurances.filter(i => i.type === type);
    } catch (error) {
      throw new Error('Failed to fetch insurances by type');
    }
  }

  // Create new insurance
  async createInsurance(data: CreateInsuranceRequest): Promise<Insurance> {
    try {
      // Mock implementation
      const newInsurance: Insurance = {
        id: Date.now().toString(),
        type: data.type,
        name: data.name,
        provider: data.provider,
        policyNumber: data.policyNumber,
        startDate: data.startDate,
        endDate: data.endDate,
        premium: data.premium,
        premiumFrequency: data.premiumFrequency,
        coverage: data.coverage,
        status: 'active',
        documents: [],
        claims: [],
        beneficiaries: data.beneficiaries,
        vehicleInfo: data.vehicleInfo,
        propertyInfo: data.propertyInfo,
        petInfo: data.petInfo,
      };
      return newInsurance;
    } catch (error) {
      throw new Error('Failed to create insurance');
    }
  }

  // Update insurance
  async updateInsurance(id: string, updates: Partial<Insurance>): Promise<Insurance> {
    try {
      // Mock implementation
      const insurance = await this.getInsurance(id);
      return { ...insurance, ...updates };
    } catch (error) {
      throw new Error('Failed to update insurance');
    }
  }

  // Delete insurance
  async deleteInsurance(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting insurance ${id}`);
    } catch (error) {
      throw new Error('Failed to delete insurance');
    }
  }

  // Add claim
  async addClaim(claim: Omit<InsuranceClaim, 'id'>): Promise<InsuranceClaim> {
    try {
      // Mock implementation
      const newClaim: InsuranceClaim = {
        id: Date.now().toString(),
        insuranceId: claim.insuranceId,
        type: claim.type,
        description: claim.description,
        amount: claim.amount,
        status: claim.status,
        date: claim.date,
        documents: claim.documents,
      };
      return newClaim;
    } catch (error) {
      throw new Error('Failed to add claim');
    }
  }

  // Update claim status
  async updateClaimStatus(claimId: string, status: InsuranceClaim['status']): Promise<void> {
    try {
      // Mock implementation
      console.log(`Updating claim ${claimId} status to ${status}`);
    } catch (error) {
      throw new Error('Failed to update claim status');
    }
  }

  // Upload document
  async uploadDocument(insuranceId: string, document: Omit<InsuranceDocument, 'id' | 'uploadDate'>): Promise<InsuranceDocument> {
    try {
      // Mock implementation
      const newDocument: InsuranceDocument = {
        id: Date.now().toString(),
        name: document.name,
        type: document.type,
        url: document.url,
        uploadDate: new Date(),
        size: document.size,
      };
      return newDocument;
    } catch (error) {
      throw new Error('Failed to upload document');
    }
  }

  // Get insurance statistics
  async getInsuranceStats(): Promise<any> {
    try {
      const insurances = await this.getInsurances();
      
      const stats = {
        totalInsurances: insurances.length,
        totalPremium: insurances.reduce((sum, insurance) => sum + insurance.premium, 0),
        totalCoverage: insurances.reduce((sum, insurance) => sum + insurance.coverage.amount, 0),
        byType: insurances.reduce((acc, insurance) => {
          acc[insurance.type] = (acc[insurance.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: insurances.reduce((acc, insurance) => {
          acc[insurance.status] = (acc[insurance.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        activeInsurances: insurances.filter(i => i.status === 'active').length,
        expiringSoon: insurances.filter(i => {
          const daysUntilExpiry = Math.ceil((i.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && i.status === 'active';
        }).length,
      };
      
      return stats;
    } catch (error) {
      throw new Error('Failed to fetch insurance statistics');
    }
  }

  // Get upcoming renewals
  async getUpcomingRenewals(days: number = 30): Promise<Insurance[]> {
    try {
      const insurances = await this.getInsurances();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      return insurances.filter(insurance => 
        insurance.endDate <= cutoffDate && 
        insurance.status === 'active'
      );
    } catch (error) {
      throw new Error('Failed to fetch upcoming renewals');
    }
  }
}

export const insuranceService = new InsuranceService();
