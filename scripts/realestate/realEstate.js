async function realEstateFormFill() {

    console.log("Emlak > Konut > Satılık > Daire");

    const changeEvent = new Event('change', {
        bubbles: true
    });

    var init = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        mode: 'cors',
        cache: 'default'
    };

    const url = chrome.extension.getURL(resources.DOM_ELEMENTS_JSON_PATH);

    let request = new Request(url, init);

    fetch(request)
        .then(function (resp) {
            return resp.json();
        }).then(async function (data) {

        // INPUTS

        let inputs = new Map();

        inputs.set(data.Generic.ClassifiedTitle, randomGenerate(5).concat(" ").concat(randomGenerate(7).concat(" ").concat(randomGenerate(8))));
        inputs.set(data.Generic.ClassifiedDetail, "<p>".concat(randomGenerate(500)).concat("</p>"));
        inputs.set(data.Generic.ClassifiedPrice, randomNumberGenerate(2).concat(".").concat(randomNumberGenerate(3)));
        inputs.set(data.RealEstate.SquareMeterGross, randomNumberGenerate(3));
        inputs.set(data.RealEstate.SquareMeterNet, randomNumberGenerate(2));
        inputs.set(data.RealEstate.Dues, randomNumberGenerate(3));

        inputs.forEach(function (value, key) {
            const input = document.querySelector(key);
            input.value = value;
            input.dispatchEvent(changeEvent);
        });

        // SELECT BOXES

        let selectBoxes = [
            data.RealEstate.RoomNumber,
            data.RealEstate.BuildingAge,
            data.RealEstate.FloorLocation,
            data.RealEstate.NumberOfFloors,
            data.RealEstate.Heating,
            data.RealEstate.NumberOfBathrooms,
            data.RealEstate.Balcony,
            data.RealEstate.UsingStatus,
            data.Generic.Exchange
        ];

        selectBoxes.forEach(function (elementName) {
            const select = document.getElementsByName(elementName)[0];

            if (select.getAttribute("an-form-object-name") === "Bulunduğu Kat") {
                selectByLabel(select, "1", changeEvent);
            } else {
                const selectBoxItems = select.options.length;
                select.selectedIndex = Math.floor(Math.random() * (selectBoxItems - 1)) + 1;
                select.dispatchEvent(changeEvent);
            }

        });

        // CHECKBOXES

        let checkboxes = [
            data.RealEstate.Furnished,
            data.RealEstate.AvailableForLoan,
            data.Generic.PostDetailInformation
        ];

        checkboxes.forEach(function (selector) {

            const checkbox = document.querySelectorAll(selector);

            checkbox.forEach(check => {
                const random_boolean = Math.random() >= 0.5;

                if (random_boolean) {
                    check.click();
                }
            })
        });


        await selectAddresses(data, true);
        await postRulesCheck(data);
    });
}

async function stepByStepRealEstateCategorySelect() {

    let isClosedDraftPopup = false;

    for (var i = 0; i <= 3; i++) {
        let category = ".category-select-box div[scrollbar='category_select_scrollbar" + i + "'] li:nth-child(1)";

        ready(category, function (element) {
            element.click();
        });

        if (!isClosedDraftPopup) {
            let popUp = "div[class='dialog-content  dialogEffect'] .dialog-buttons > button:nth-child(2)";

            ready(popUp, function (element) {
                element.click();
                isClosedDraftPopup = true;
            });
        }
    }

    ready(".process-done button", function (element) {
        element.click();
    });
}