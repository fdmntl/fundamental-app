import { supabase } from '~/supabaseConfig';
import { PostgrestResponse } from '@supabase/supabase-js';

interface InsertDataProps<T> {
    data: T[];
    tableName: string;
    upsert?: boolean;
}

export const insertData = async <T>({ data, tableName, upsert = false }: InsertDataProps<T>): Promise<T[]> => {
    if (!data.length) {
        throw new Error("Data array cannot be empty.");
    }

    let response: PostgrestResponse<T>;

    if (upsert) {
        response = await supabase.from<T>(tableName).upsert(data);
    } else {
        response = await supabase.from<T>(tableName).insert(data);
    }

    if (response.error) {
        throw response.error;
    }

    return response.data ?? [];
};