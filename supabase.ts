
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvywceybsdfyyuwvsqnq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Y8Svmtm2izqn29fKXXQHdA_YbSVAJ86';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
