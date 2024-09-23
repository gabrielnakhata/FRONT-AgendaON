import { useEffect } from 'react';
import { locale, addLocale } from 'primereact/api';

const getNextAvailableDate = () => {
    const today = new Date();
    const day = today.getDay();

    if (day === 0) {
        today.setDate(today.getDate() + 2);
    } else if (day === 1) {
        today.setDate(today.getDate() + 1);
    }
    return today;
};

const usePrimeReactLocale = () => {
    useEffect(() => {
        addLocale('pt-BR', {
            firstDayOfWeek: 0,
            dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
            dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
            monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            today: "Hoje",
            clear: "Limpar"
        });
        locale('pt-BR');
    }, []);

    return { getNextAvailableDate };
};

export default usePrimeReactLocale;
