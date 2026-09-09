// src/utils/formatGreetingDate.js
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatGreetingDate(date = new Date()) {
    return format(date, 'EEEE d MMMM', { locale: fr });
}