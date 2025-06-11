import { supabase } from '~/supabaseConfig';

export async function updateENS(userId: string, newENS: string) {
  if (!userId) {
    throw new Error('❌ User ID is required.');
  }
  if (!newENS) {
    throw new Error('❌ ENS value is required.');
  }

  const { error } = await supabase.from('users').update({ ens: newENS }).eq('id', userId);

  if (error) {
    console.error('❌ Error updating ENS:', error.message);
    throw new Error(`query failed: ${error.message}`);
  }

  console.log('✅ ENS updated successfully');
}
