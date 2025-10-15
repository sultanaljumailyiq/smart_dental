import { Request, Response } from "express";
import { clinicDirectoryService } from "../services/clinicDirectoryService";

// Get clinics with filters
export async function getClinics(req: Request, res: Response) {
  try {
    const {
      governorate,
      city,
      userLat,
      userLng,
      radiusKm,
      specialty,
      mode = 'distance',
      limit = 20
    } = req.query;

    const clinics = await clinicDirectoryService.getClinics({
      governorate: governorate as string,
      city: city as string,
      userLat: userLat ? parseFloat(userLat as string) : undefined,
      userLng: userLng ? parseFloat(userLng as string) : undefined,
      radiusKm: radiusKm ? parseInt(radiusKm as string) : undefined,
      specialty: specialty as string,
      mode: (mode as 'distance' | 'promoted') || 'distance',
      limit: parseInt(limit as string) || 20
    });

    res.json(clinics);
  } catch (error) {
    console.error('Error getting clinics:', error);
    res.status(500).json({ error: 'Failed to get clinics' });
  }
}

// Get nearby clinics
export async function getNearbyClinics(req: Request, res: Response) {
  try {
    const { lat, lng, radius = 50, mode = 'distance', limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const clinics = await clinicDirectoryService.getNearbyClinics(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseInt(radius as string),
      mode as 'distance' | 'promoted',
      parseInt(limit as string)
    );

    res.json(clinics);
  } catch (error) {
    console.error('Error getting nearby clinics:', error);
    res.status(500).json({ error: 'Failed to get nearby clinics' });
  }
}

// Get clinic by ID
export async function getClinicById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const clinic = await clinicDirectoryService.getClinicById(parseInt(id));

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    res.json(clinic);
  } catch (error) {
    console.error('Error getting clinic:', error);
    res.status(500).json({ error: 'Failed to get clinic' });
  }
}

// Get clinics by governorate
export async function getClinicsByGovernorate(req: Request, res: Response) {
  try {
    const { governorate } = req.params;
    const { mode = 'distance' } = req.query;

    const clinics = await clinicDirectoryService.getClinicsByGovernorate(
      governorate,
      mode as 'distance' | 'promoted'
    );

    res.json(clinics);
  } catch (error) {
    console.error('Error getting clinics by governorate:', error);
    res.status(500).json({ error: 'Failed to get clinics' });
  }
}

// Seed Iraqi clinics (development only)
export async function seedClinics(req: Request, res: Response) {
  try {
    await clinicDirectoryService.seedIraqiClinics();
    res.json({ message: 'Iraqi clinics seeded successfully' });
  } catch (error) {
    console.error('Error seeding clinics:', error);
    res.status(500).json({ error: 'Failed to seed clinics' });
  }
}
