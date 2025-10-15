import { Request, Response } from "express";
import { staffService } from "../services/staffService";

// Get all staff for a clinic
export async function getClinicStaff(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    
    if (!clinicId) {
      return res.status(400).json({ error: "Clinic ID is required" });
    }

    const staff = await staffService.getClinicStaff(parseInt(clinicId));
    res.json(staff);
  } catch (error) {
    console.error("Error getting clinic staff:", error);
    res.status(500).json({ error: "Failed to get clinic staff" });
  }
}

// Get staff member by ID
export async function getStaffById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const staff = await staffService.getStaffById(parseInt(id));

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error getting staff member:", error);
    res.status(500).json({ error: "Failed to get staff member" });
  }
}

// Create new staff member
export async function createStaff(req: Request, res: Response) {
  try {
    const input = req.body;

    if (!input.clinicId || !input.name || !input.arabicName || !input.role) {
      return res.status(400).json({ 
        error: "Clinic ID, name, Arabic name, and role are required" 
      });
    }

    const staff = await staffService.createStaff(input);
    res.status(201).json(staff);
  } catch (error) {
    console.error("Error creating staff member:", error);
    res.status(500).json({ error: "Failed to create staff member" });
  }
}

// Update staff member
export async function updateStaff(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const input = req.body;

    const staff = await staffService.updateStaff(parseInt(id), input);

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error updating staff member:", error);
    res.status(500).json({ error: "Failed to update staff member" });
  }
}

// Delete staff member
export async function deleteStaff(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await staffService.deleteStaff(parseInt(id));

    if (!success) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
}

// Staff login
export async function staffLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: "اسم المستخدم وكلمة المرور مطلوبان" 
      });
    }

    const result = await staffService.authenticateStaff(username, password);

    if (!result.success || !result.staff) {
      return res.status(401).json({ 
        error: "اسم المستخدم أو كلمة المرور غير صحيحة" 
      });
    }

    res.json({ staff: result.staff });
  } catch (error) {
    console.error("Error during staff login:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
  }
}

// Check if user has permission
export async function checkPermission(req: Request, res: Response) {
  try {
    const { userId, resource, action, clinicId } = req.query;

    if (!userId || !resource || !action) {
      return res.status(400).json({ 
        error: "User ID, resource, and action are required" 
      });
    }

    const hasPermission = await staffService.hasPermission(
      parseInt(userId as string),
      resource as string,
      action as string,
      clinicId ? parseInt(clinicId as string) : undefined
    );

    res.json({ hasPermission });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ error: "Failed to check permission" });
  }
}
