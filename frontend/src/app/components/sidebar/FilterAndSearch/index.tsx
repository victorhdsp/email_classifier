import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FilterAndSearch.module.scss';

interface FilterAndSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: 'all' | 'Produtivo' | 'Improdutivo';
  setFilterType: (type: 'all' | 'Produtivo' | 'Improdutivo') => void;
}

const FilterAndSearch: React.FC<FilterAndSearchProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => {
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Buscar por assunto ou conteúdo..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select.Root
        value={filterType}
        onValueChange={(value: 'all' | 'Produtivo' | 'Improdutivo') => setFilterType(value)}
      >
        <Select.Trigger className={styles.selectTrigger} aria-label="Classificação de Email">
          <Select.Value/>
          <Select.Icon className={styles.selectIcon}>
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.selectContent}>
            <Select.ScrollUpButton className={styles.selectScrollButton}>
              <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className={styles.selectViewport}>
              <Select.Item value="all" className={styles.selectItem}>
                <Select.ItemText>Todos</Select.ItemText>
              </Select.Item>
              <Select.Item value="Produtivo" className={styles.selectItem}>
                <Select.ItemText>Produtivo</Select.ItemText>
              </Select.Item>
              <Select.Item value="Improdutivo" className={styles.selectItem}>
                <Select.ItemText>Improdutivo</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton className={styles.selectScrollButton}>
              <ChevronDown />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default FilterAndSearch;