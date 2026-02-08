import { DiscountListPage } from './Discounts/List';
import { DiscountFormPage } from './Discounts/Form';
import { FormSimulatorPage } from './Discounts/FormSimulator';
import { DiscountDetailsPage } from './Discounts/Details';

export type Page =
  | { view: 'list' }
  | { view: 'form' }
  | { view: 'simulator'; discountId?: string }
  | { view: 'details'; discountId: string };

interface HomeProps {
  page: Page;
  setPage: (page: Page) => void;
}

function Home({ page, setPage }: HomeProps) {

  return (
    <div className="container">
      {page.view === 'list' && (
        <DiscountListPage
          onNavigateToSimulator={(id) => setPage({ view: 'simulator', discountId: id })}
          onNavigateToDetails={(id) => setPage({ view: 'details', discountId: id })}
        />
      )}

      {page.view === 'form' && (
        <DiscountFormPage
          onNavigateToList={() => setPage({ view: 'list' })}
        />
      )}

      {page.view === 'simulator' && (
        <FormSimulatorPage
          discountId={page.discountId}
          onNavigateToList={() => setPage({ view: 'list' })}
        />
      )}

      {page.view === 'details' && (
        <DiscountDetailsPage
          discountId={page.discountId}
          onNavigateToList={() => setPage({ view: 'list' })}
        />
      )}
    </div>
  );
}

export default Home;
