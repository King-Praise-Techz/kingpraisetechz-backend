const User = require('../models/User.model');

// ─── Hardcoded admin credentials ─────────────────────────────────────
const ADMIN_EMAIL    = 'chibuksai@gmail.com';
const ADMIN_PASSWORD = 'Admin@2';

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (!existing) {
      await User.create({
        firstName: 'Chibuks',
        lastName:  'Admin',
        email:     ADMIN_EMAIL,
        password:  ADMIN_PASSWORD,
        role:      'admin',
        isActive:  true,
        isVerified: true,
        twoFactorEnabled: false,   // admin bypasses 2FA
        onboardingComplete: true,
        permanentAdmin: true,
      });
      console.log(`✅ Admin user seeded: ${ADMIN_EMAIL}`);
    } else {
      // Ensure the admin record is always consistent (role, active, no 2FA lock)
      let changed = false;
      if (existing.role !== 'admin')               { existing.role = 'admin';               changed = true; }
      if (!existing.isActive)                       { existing.isActive = true;               changed = true; }
      if (!existing.permanentAdmin)                 { existing.permanentAdmin = true;         changed = true; }
      if (existing.twoFactorEnabled)                { existing.twoFactorEnabled = false;      changed = true; }
      if (changed) await existing.save();
      console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

module.exports = { seedAdmin };