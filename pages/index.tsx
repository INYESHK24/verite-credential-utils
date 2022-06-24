import type { NextPage } from "next"
import { useMemo, useState } from "react"
import { challengeTokenUrlWrapper } from "verite"

import QRCode from "components/credentials/QRCode"
import SelectBox from "components/form/SelectBox"
import {
  CredentialIssuer,
  CredentialStatus,
  CredentialType,
  CREDENTIAL_ISSUERS,
  CREDENTIAL_STATUSES,
  CREDENTIAL_TYPES
} from "lib/credential-fns"
import { fullURL } from "lib/url-fns"

const Page: NextPage = () => {
  const [customType, setCustomType] = useState<CredentialType>(
    CREDENTIAL_TYPES[0]
  )
  const [customIssuer, setCustomIssuer] = useState<CredentialIssuer>(
    CREDENTIAL_ISSUERS[0]
  )
  const [customStatus, setCustomStatus] = useState<CredentialStatus>(
    CREDENTIAL_STATUSES[0]
  )

  const qrCodeContents = useMemo(() => {
    return challengeTokenUrlWrapper(
      fullURL(
        `/api/credential-offer?type=${customType.id}&issuer=${customIssuer.id}&status=${customStatus.id}`
      )
    )
  }, [customType, customIssuer, customStatus])

  return (
    <>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="mt-2 text-xl font-medium text-gray-900">
          Credential Faucet
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          This faucet provides sample credentials in different states, by
          different issuers, to allow you to test your Verite integration.
        </p>
      </div>
      <div className="mt-10">
        <div className="py-4">
          <div className="flex flex-col-reverse space-x-2 space-y-2 sm:flex-row">
            <div className="sm:w-1/2">
              <form className="flex flex-col space-y-4">
                <div>
                  <SelectBox
                    label="Credential Type"
                    labelTooltip="Select the type of credential you want to generate"
                    items={CREDENTIAL_TYPES}
                    selected={customType}
                    setSelected={setCustomType}
                  />
                </div>

                <div>
                  <SelectBox
                    label="Issuer"
                    labelTooltip={`Select the issuer of this credential. By default '${
                      CREDENTIAL_ISSUERS.find((c) => c.isTrusted)?.name
                    }' is the only trusted issuer, but this can be customized on the verifier screen`}
                    items={CREDENTIAL_ISSUERS}
                    selected={customIssuer}
                    setSelected={setCustomIssuer}
                  />
                </div>

                <div>
                  <SelectBox
                    label="Status"
                    labelTooltip="Select the current status of this credential, either active, expiring, expired, or revoked."
                    items={CREDENTIAL_STATUSES}
                    selected={customStatus}
                    setSelected={setCustomStatus}
                  />
                </div>
              </form>
            </div>
            <div className="text-right sm:w-1/2">
              <QRCode
                contents={qrCodeContents}
                link={qrCodeContents.challengeTokenUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
