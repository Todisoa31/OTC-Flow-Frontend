import RepartitionCharge from '@/components/head-origination/new-folder/RepartitionCharge';
import { useTitle } from '@/providers/TitleProvider';
import React from 'react';

const Page = () => {
  return (
    <div className='w-full overflow-y-auto' id="container-folder">
      <RepartitionCharge />
    </div>
  );
}

export default Page;
