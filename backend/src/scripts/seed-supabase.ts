import { supabaseAdmin } from '../config/supabase';
import { DbService } from '../services/db.service';

async function seedSupabase() {
  console.log('🚀 Démarrage du nettoyage et réinitialisation vers Supabase Cloud...');

  // 1. Nettoyer les anciens rendez-vous de test dans Supabase
  console.log('🧹 Purge des anciens rendez-vous de test dans Supabase...');
  try {
    const { error: delAptErr } = await supabaseAdmin
      .from('appointments')
      .delete()
      .neq('id', 'NONE');
    if (delAptErr) {
      console.warn('⚠️ Avertissement suppression appointments Supabase:', delAptErr.message);
    } else {
      console.log('✅ Rendez-vous de test purgés de Supabase.');
    }
  } catch (err: any) {
    console.warn('⚠️ Exception purge appointments:', err.message);
  }

  // 2. Nettoyer les anciens profils dans Supabase
  console.log('🧹 Purge des anciens comptes/patients dans Supabase...');
  try {
    const { error: delProfErr } = await supabaseAdmin
      .from('profiles')
      .delete()
      .neq('email', 'NONE');
    if (delProfErr) {
      console.warn('⚠️ Avertissement suppression profiles Supabase:', delProfErr.message);
    } else {
      console.log('✅ Anciens profils purgés de Supabase.');
    }
  } catch (err: any) {
    console.warn('⚠️ Exception purge profiles:', err.message);
  }

  // 3. Synchroniser les structures sanitaires & spécialités
  const facilities = DbService.readLocalFacilities();
  console.log(`\n🏥 Synchronisation de ${facilities.length} établissements sanitaires...`);

  for (const f of facilities) {
    const { error: fErr } = await supabaseAdmin.from('facilities').upsert({
      id: f.id,
      name: f.name,
      type: f.type,
      region: f.region,
      district: f.district,
      address: f.address,
      phone: f.phone,
      updated_at: new Date().toISOString()
    });

    if (fErr) {
      console.error(`❌ Erreur facility ${f.id}:`, fErr.message);
    } else {
      console.log(`✅ Structure : ${f.name} [${f.type}]`);
    }

    // Spécialités
    for (const spec of f.specialties) {
      const { error: sErr } = await supabaseAdmin.from('facility_specialties').upsert({
        id: spec.id,
        facility_id: f.id,
        name: spec.name,
        is_active: spec.isActive,
        ticket_price: spec.ticketPrice,
        available_days: spec.availableDays,
        start_time: spec.startTime,
        end_time: spec.endTime,
        slot_duration: spec.slotDuration,
        max_patients_per_slot: spec.maxPatientsPerSlot,
        assigned_doctors: spec.assignedDoctors || [],
        doctor_assignments: spec.doctorAssignments || [],
        updated_at: new Date().toISOString()
      });

      if (sErr) {
        console.error(`  ❌ Spécialité ${spec.name}:`, sErr.message);
      }
    }
  }

  // 4. Synchroniser les 10 comptes officiels épurés
  const users = DbService.readLocalUsers();
  console.log(`\n👥 Synchronisation des ${users.length} comptes de référence officiels...`);

  for (const u of users) {
    const { error: uErr } = await supabaseAdmin.from('profiles').upsert({
      email: u.email.toLowerCase(),
      name: u.name,
      role: u.role,
      password_hash: u.passwordHash,
      suspended: u.suspended || false,
      details: u.details || {},
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' });

    if (uErr) {
      console.error(`❌ Profil ${u.email}:`, uErr.message);
    } else {
      console.log(`✅ Compte inséré : ${u.name} (${u.email}) [Rôle: ${u.role}]`);
    }
  }

  console.log('\n🎉 Base Supabase Cloud & DB locale 100% synchronisées et prêtes pour les tests réels !');
}

seedSupabase().catch(err => {
  console.error('Erreur critique pendant le seed Supabase :', err);
  process.exit(1);
});
