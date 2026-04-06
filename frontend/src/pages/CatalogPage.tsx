import { useState } from 'react';
import CartSummary from '../components/CartSummary';
import ContainerFilter from '../components/ContainerFilter';
import Header from '../components/Header';
import ProgramEntryList from '../components/ProgramEntryList';

function CatalogPage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

  return (
    <div className="Container mt-4">
      <CartSummary />
      <Header />
      <div className="row">
        <div className="col-md-3">
          <ContainerFilter
            selectedContainers={selectedContainers}
            setSelectedContainers={setSelectedContainers}
          />
        </div>
        <div className="col-md-9">
          <div className="mb-3 text-muted">
            Explore Angels' Landing impact entries across safehouses, partner
            programs, and support initiatives.
          </div>
          <ProgramEntryList selectedContainers={selectedContainers} />
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;
