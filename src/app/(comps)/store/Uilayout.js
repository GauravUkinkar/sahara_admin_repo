import { create } from "zustand";
import { persist } from 'zustand/middleware';


const UilayoutStore = create(
    persist(
        (set) => ({
            sidebar: false,
            toggleUi: () =>
                set((state) => {
                    const newMode = !state.sidebar;
                    return { sidebar: newMode };
                }),
        }),
        { name: 'ui-layout' }
    )
);

export default UilayoutStore;