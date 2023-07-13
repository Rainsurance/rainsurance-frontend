import Layout from '@/layout/Layout';
import { statusBundles } from '../utils/statusbundles';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {
  FlexInitial,
  Bundle,
  Table,
  TableHeader,
  TableBody,
  Status,
} from '../styles/bundles';

const BundleView = () => {
  return (
    <FlexInitial>
      <Layout title="Bundles">
        <Bundle>
          <h2>
            <span>Risk bundles</span>
          </h2>

          <Table>
            <OverlayScrollbarsComponent defer>
              <TableHeader>
                <p>ID</p>
                <p>NAME</p>
                <p>STATE</p>
                <p>APR</p>
                <p>BALANCE</p>
                <p>CAPACITY</p>
                <p>STAKES</p>
                <p>OPEN UNTIL</p>
                <p>POLICIES</p>
              </TableHeader>
              {statusBundles.map((item, index) => (
                <TableBody key={index}>
                  <p>{item.id}</p>
                  <p>{item.name}</p>
                  <p>{item.state}</p>
                  <p>{item.apr}</p>
                  <p>{item.balance}</p>
                  <p>{item.capacity}</p>
                  <Status color={item.colorstatus} />
                  <p>{item.openuntil}</p>
                  <p>{item.policies}</p>
                </TableBody>
              ))}
              <br />
            </OverlayScrollbarsComponent>
          </Table>
        </Bundle>
      </Layout>
    </FlexInitial>
  );
};
export default BundleView;
